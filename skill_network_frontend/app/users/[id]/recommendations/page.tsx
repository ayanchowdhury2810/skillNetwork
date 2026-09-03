'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import { useToast } from '../../../../lib/toast-context';
import Layout from '../../../../components/Layout';
import RecommendationCard from '../../../../components/RecommendationCard';

interface Recommendation {
  userId: string;
  name: string;
  score: number;
  commonSkills: string[];
}

export default function RecommendationsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    loadRecommendations();
  }, [userId]);

  const loadRecommendations = async () => {
    try {
      const data = await api.get<Recommendation[]>(`/users/${userId}/recommendations`);
      setRecommendations(data);
    } catch (error) {
      addToast('Failed to load recommendations', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Recommended Connections</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations.map((rec) => (
              <RecommendationCard
                key={rec.userId}
                userId={rec.userId}
                name={rec.name}
                score={rec.score}
                commonSkills={rec.commonSkills}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-600">No recommendations available.</p>
            <p className="text-gray-500 text-sm mt-2">Add more skills to improve matching.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
