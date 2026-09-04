'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { User, Skill } from '../../../lib/types';
import { useToast } from '../../../lib/toast-context';
import Layout from '../../../components/Layout';
import AddSkillModal from '../../../components/AddSkillModal';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      const [userData, skillsData] = await Promise.all([
        api.get<User>(`/users/${userId}`),
        api.get<Skill[]>(`/users/${userId}/skills`),
      ]);
      setUser(userData);
      setSkills(skillsData);
    } catch (error) {
      addToast('Failed to load user data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSkillAdded = () => {
    loadUserData();
  };

  const handleDelete = async () => {
    if (!user) return;
    if (!confirm(`Delete user "${user.name}"? This cannot be undone.`)) return;

    try {
      await api.delete(`/users/${userId}`);
      addToast(`User "${user.name}" deleted`, 'success');
      router.push('/users');
    } catch (error) {
      addToast('Failed to delete user', 'error');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User not found</h1>
          <button
            onClick={() => router.push('/users')}
            className="px-4 py-2 bg-[#2563EB] text-white rounded-lg"
          >
            Back To Users
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500 mt-2">User ID: {user.id}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Delete User
              </button>
              <div className="w-16 h-16 bg-[#7C3AED] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
          {skills.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 text-center">
                  <span className="text-sm font-medium text-gray-900">{skill.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No skills added yet.</p>
              <button
                onClick={() => setModalOpen(true)}
                className="px-4 py-2 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Add First Skill
              </button>
            </div>
          )}
          {skills.length > 0 && (
            <button
              onClick={() => setModalOpen(true)}
              className="mt-4 px-4 py-2 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Add Skill
            </button>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => router.push(`/users/${userId}/recommendations`)}
            className="px-6 py-3 bg-[#7C3AED] text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            View Recommendations
          </button>
        </div>

        <AddSkillModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          userId={userId}
          onSkillAdded={handleSkillAdded}
        />
      </div>
    </Layout>
  );
}
