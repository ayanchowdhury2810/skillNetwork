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

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <button
            onClick={() => router.push('/users/create')}
            className="px-4 py-2 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Create User</span>
          </button>
        </div>

        {/* Search - commented out for now
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search User
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
          />
        </div>
        */}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <UserCard key={user.u.properties.id} id={user.u.properties.id} name={user.u.properties.name} skills={user.skills} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
