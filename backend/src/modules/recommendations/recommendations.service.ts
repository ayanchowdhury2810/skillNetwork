import type {
  RecommendationJob,
  CandidateProfile,
  Job,
  ScoreBreakdown,
} from "./recommendations.types.js";
import * as repository from "./recommendations.repository.js";

const MAX_SKILL_SCORE = 60;
const MAX_EXPERIENCE_SCORE = 25;
const MAX_LOCATION_SCORE = 15;

const calculateSkillScore = (
  candidateSkills: string[],
  jobSkills: string[]
): number => {
  if (jobSkills.length === 0) return MAX_SKILL_SCORE;

  const matched = candidateSkills.filter((s) =>
    jobSkills.includes(s)
  ).length;

  return (matched / jobSkills.length) * MAX_SKILL_SCORE;
};

const calculateExperienceScore = (
  candidateExperience: number,
  requiredExperience: number
): number => {
  if (requiredExperience <= 0) return MAX_EXPERIENCE_SCORE;
  if (candidateExperience >= requiredExperience) return MAX_EXPERIENCE_SCORE;

  return (candidateExperience / requiredExperience) * MAX_EXPERIENCE_SCORE;
};

const calculateLocationScore = (
  candidateLocation: string,
  jobLocation: string,
  jobIsRemote: boolean
): number => {
  const candidateIsRemote =
    candidateLocation.toLowerCase() === "remote";

  if (candidateIsRemote && jobIsRemote) return MAX_LOCATION_SCORE;
  if (
    candidateLocation.toLowerCase() === jobLocation.toLowerCase()
  )
    return MAX_LOCATION_SCORE;

  return 0;
};

export const calculateScore = (
  candidate: CandidateProfile,
  job: Job
): ScoreBreakdown => {
  const skillsScore = calculateSkillScore(
    candidate.skills,
    job.requiredSkills
  );
  const experienceScore = calculateExperienceScore(
    candidate.experience,
    job.requiredExperience
  );
  const locationScore = calculateLocationScore(
    candidate.preferredLocation,
    job.location,
    job.isRemote
  );

  return {
    skillsScore: Math.round(skillsScore * 100) / 100,
    experienceScore: Math.round(experienceScore * 100) / 100,
    locationScore: Math.round(locationScore * 100) / 100,
    total:
      Math.round(
        (skillsScore + experienceScore + locationScore) * 100
      ) / 100,
  };
};

export const getRecommendations = async (
  userId: string,
  page: number,
  limit: number
): Promise<{ jobs: RecommendationJob[]; total: number }> => {
  const profileResult =
    await repository.getCandidateProfile(userId);

  if (
    !profileResult.data ||
    profileResult.data.length === 0
  ) {
    return { jobs: [], total: 0 };
  }

  const profileRow = profileResult.data[0] as Record<
    string,
    unknown
  >;
  const user = profileRow["u"] as {
    properties: { experience?: number; preferredLocation?: string };
  };

  const candidate: CandidateProfile = {
    skills: (profileRow["skills"] as string[]) ?? [],
    experience: (user?.properties?.experience as number) ?? 0,
    preferredLocation:
      (user?.properties?.preferredLocation as string) ?? "Remote",
  };

  const jobsResult = await repository.getActiveJobs();

  if (!jobsResult.data) {
    return { jobs: [], total: 0 };
  }

  const appliedResult =
    await repository.getAppliedJobIds(userId);
  const appliedJobIds = new Set(
    (appliedResult.data ?? []).map(
      (row) => (row as Record<string, unknown>)["jobId"] as string
    )
  );

  const recommendations: RecommendationJob[] = [];

  for (const row of jobsResult.data) {
    const record = row as Record<string, unknown>;
    const jobNode = record["j"] as {
      id: string;
      properties: {
        id: string;
        title: string;
        companyId?: string;
        companyName?: string;
        requiredExperience?: number;
        location?: string;
        isRemote?: boolean;
      };
    };

    if (appliedJobIds.has(jobNode.properties.id)) continue;

    const job: Job = {
      id: jobNode.properties.id,
      title: jobNode.properties.title,
      companyId: jobNode.properties.companyId ?? "",
      companyName: jobNode.properties.companyName ?? "",
      requiredSkills: (record["requiredSkills"] as string[]) ?? [],
      requiredExperience:
        jobNode.properties.requiredExperience ?? 0,
      location: jobNode.properties.location ?? "Remote",
      isRemote: jobNode.properties.isRemote ?? false,
      status: "active",
    };

    const score = calculateScore(candidate, job);

    recommendations.push({
      jobId: job.id,
      title: job.title,
      company: job.companyName,
      score: score.total,
    });
  }

  recommendations.sort((a, b) => b.score - a.score);

  const total = recommendations.length;
  const start = (page - 1) * limit;
  const paginated = recommendations.slice(start, start + limit);

  return { jobs: paginated, total };
};
