'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../lib/api';
import { Recommendation } from '../../../lib/types';
import { useToast } from '../../../lib/toast-context';
import Layout from '../../../components/Layout';

export default function RecommendationsPage() {
  const params = useParams();
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Recommendations</h1>
        <p className="text-gray-600 mb-6">Users with similar skills to you</p>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No recommendations found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <div
                key={rec.userId}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900">{rec.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Match Score: {(rec.score * 100).toFixed(0)}%
                </p>
                {rec.commonSkills && rec.commonSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {rec.commonSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
