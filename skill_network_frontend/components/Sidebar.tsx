'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const linkClasses = (path: string) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
      isActive(path)
        ? 'bg-[#2563EB] text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)] p-4">
      <nav className="space-y-2">
        <Link href="/users" className={linkClasses('/users')}>
          <span>🏠</span>
          <span>Home</span>
        </Link>
        <Link href="/users" className={linkClasses('/users')}>
          <span>👥</span>
          <span>Users</span>
        </Link>
        <Link href="/users/create" className={linkClasses('/users/create')}>
          <span>➕</span>
          <span>Create User</span>
        </Link>
      </nav>
    </aside>
  );
}
