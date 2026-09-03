'use client';
import React from 'react';
import Link from 'next/link';

interface UserCardProps {
  id: string;
  name: string;
}

export default function UserCard({ id, name }: UserCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500 mt-1">ID: {id}</p>
        </div>
        <Link
          href={`/users/${id}`}
          className="px-4 py-2 bg-[#2563EB] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
