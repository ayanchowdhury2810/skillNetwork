'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { useToast } from '../../../lib/toast-context';
import Layout from '../../../components/Layout';

interface SkillItem {
  name: string;
}

export default function DomainDetailPage() {
  const params = useParams();
  const router = useRouter();
  const domainName = decodeURIComponent(params.name as string);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState('');
  const [adding, setAdding] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    loadSkills();
  }, [domainName]);

  const loadSkills = async () => {
    try {
      const data = await api.get<SkillItem[]>(`/domains/${encodeURIComponent(domainName)}/skills`);
      setSkills(data);
    } catch (error) {
      addToast('Failed to load domain skills', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (!trimmed) return;

    setAdding(true);
    try {
      await api.post(`/domains/${encodeURIComponent(domainName)}/skills`, { skill: trimmed });
      addToast(`Skill "${trimmed}" added to ${domainName}`, 'success');
      setNewSkill('');
      loadSkills();
    } catch (error) {
      addToast('Failed to add skill', 'error');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{domainName}</h1>
            <p className="text-gray-500 mt-1">Domain Skills</p>
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Add Skill to Domain</h2>
          <form onSubmit={handleAddSkill} className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="e.g. React, Python, Docker"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
            />
            <button
              type="submit"
              disabled={adding || !newSkill.trim()}
              className="px-4 py-2 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {adding ? 'Adding...' : 'Add'}
            </button>
          </form>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No skills in this domain yet. Add one above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
              >
                <span className="text-sm font-medium text-gray-900">{skill.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
