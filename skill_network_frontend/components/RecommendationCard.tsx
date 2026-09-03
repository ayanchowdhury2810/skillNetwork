'use client';
import React from 'react';
import Link from 'next/link';
import SkillBadge from './SkillBadge';

interface RecommendationCardProps {
  userId: string;
  name: string;
  score: number;
  commonSkills: string[];
}

export default function RecommendationCard({ userId, name, score, commonSkills }: RecommendationCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500">ID: {userId}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#2563EB]">{score}</div>
          <div className="text-xs text-gray-500">Similarity Score</div>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Shared Skills</p>
        <div className="flex flex-wrap gap-2">
          {commonSkills.map((skill, index) => (
            <SkillBadge key={index} skill={skill} />
          ))}
        </div>
      </div>
      <Link
        href={`/users/${userId}`}
        className="inline-block px-4 py-2 bg-[#2563EB] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        View Profile
      </Link>
    </div>
  );
}
