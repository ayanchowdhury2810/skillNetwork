import React from 'react';
import Link from 'next/link';
import { api } from '../lib/api';
import { User } from '../lib/types';

async function getStats() {
  try {
    const users = await api.get<User[]>('/users');
    return {
      totalUsers: users.length,
    };
  } catch {
    return { totalUsers: 0 };
  }
}

export default async function LandingPage() {
  const stats = await getStats();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-[#2563EB] rounded-xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl font-bold">S</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Skill Network
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover developers with similar skills
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Powered by FalkorDB Graph Database
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/users"
              className="px-6 py-3 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              View Users
            </Link>
            <Link
              href="/users/create"
              className="px-6 py-3 bg-white text-[#2563EB] border-2 border-[#2563EB] rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Create User
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h3 className="text-4xl font-bold text-[#2563EB] mb-2">
              {stats.totalUsers}
            </h3>
            <p className="text-gray-600">Total Users</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-4xl font-bold text-[#7C3AED] mb-2">
              ⚡
            </div>
            <p className="text-gray-600">Graph-Powered Recommendations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
