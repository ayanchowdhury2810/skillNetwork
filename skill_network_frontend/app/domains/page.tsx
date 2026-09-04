'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '../../lib/api';
import { useToast } from '../../lib/toast-context';
import Layout from '../../components/Layout';
import { Domain } from '../../lib/types';

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDomain, setNewDomain] = useState('');
  const [creating, setCreating] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    loadDomains();
  }, []);

  const loadDomains = async () => {
    try {
      const data = await api.get<Domain[]>('/domains');
      setDomains(data);
    } catch (error) {
      addToast('Failed to load domains', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newDomain.trim();
    if (!trimmed) return;

    setCreating(true);
    try {
      await api.post('/domains', { name: trimmed });
      addToast(`Domain "${trimmed}" created`, 'success');
      setNewDomain('');
      loadDomains();
    } catch (error) {
      addToast('Failed to create domain', 'error');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Domains</h1>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Create Domain</h2>
          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              type="text"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="e.g. Frontend, Backend, AI"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
            />
            <button
              type="submit"
              disabled={creating || !newDomain.trim()}
              className="px-4 py-2 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
          </form>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : domains.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No domains yet. Create one above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.map((domain) => (
              <Link
                key={domain.name}
                href={`/domains/${encodeURIComponent(domain.name)}`}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow block"
              >
                <h3 className="text-lg font-semibold text-gray-900">{domain.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Click to view skills</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
