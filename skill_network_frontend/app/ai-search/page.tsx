'use client';
import React, { useState } from 'react';
import { api } from '../../lib/api';
import { useToast } from '../../lib/toast-context';
import Layout from '../../components/Layout';

interface SearchResult {
  success: boolean;
  answer: string;
}

const EXAMPLE_QUERIES = [
  'Find frontend developers interested in AI',
  'Who knows Docker and Kubernetes?',
  'Find backend developers skilled in PostgreSQL',
  'Find full-stack developers',
  'Who should I learn React from?',
  'Suggest developers for an AI startup project',
];

export default function AiSearchPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setResult(null);
    try {
      const data = await api.post<SearchResult>('/ai/search', { query: trimmed });
      setResult(data);
    } catch (error) {
      addToast('Failed to get answer. Make sure OPENAI_API_KEY is set in .env', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ask the Network</h1>
          <p className="text-gray-600">
            Use natural language to search developers, skills, and connections
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Find frontend developers interested in AI"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none text-base"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </button>
          </form>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUERIES.map((example) => (
              <button
                key={example}
                onClick={() => handleExampleClick(example)}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">AI</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Answer</h2>
            </div>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
              {result.answer}
            </div>
          </div>
        )}

        {!result && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-gray-500">
              Ask a question about developers, skills, or domains
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
