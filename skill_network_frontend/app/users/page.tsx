'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { useToast } from '../../lib/toast-context';
import Layout from '../../components/Layout';
import UserCard from '../../components/UserCard';

interface FalkorUser {
  u: { properties: { id: string; name: string } };
  skills: string[];
}

export default function UsersPage() {
  const [users, setUsers] = useState<FalkorUser[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { addToast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await api.get<FalkorUser[]>('/users');
      setUsers(data);
    } catch (error) {
      addToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Delete user "${userName}"? This cannot be undone.`)) return;

    try {
      await api.delete(`/users/${userId}`);
      addToast(`User "${userName}" deleted`, 'success');
      setUsers(users.filter((u) => u.u.properties.id !== userId));
    } catch (error) {
      addToast('Failed to delete user', 'error');
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                if (!confirm('Delete ALL users? This cannot be undone.')) return;
                try {
                  await api.delete('/users');
                  addToast('All users deleted', 'success');
                  setUsers([]);
                } catch (error) {
                  addToast('Failed to delete all users', 'error');
                }
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              Delete All
            </button>
            <button
              onClick={() => router.push('/users/create')}
              className="px-4 py-2 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span>➕</span>
              <span>Create User</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No users yet.</p>
            <button
              onClick={() => router.push('/users/create')}
              className="px-4 py-2 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create First User
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div key={user.u.properties.id} className="relative">
                <UserCard
                  id={user.u.properties.id}
                  name={user.u.properties.name}
                  skills={user.skills}
                />
                <button
                  onClick={() => handleDeleteUser(user.u.properties.id, user.u.properties.name)}
                  className="absolute top-3 right-3 w-7 h-7 bg-red-50 text-red-500 rounded-full text-sm font-bold hover:bg-red-100 hover:text-red-600 transition-colors flex items-center justify-center"
                  title="Delete user"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
