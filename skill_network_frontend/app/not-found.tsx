import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#2563EB] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <Link
          href="/users"
          className="px-6 py-3 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Back To Users
        </Link>
      </div>
    </div>
  );
}
