'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

/* =======================
   Types (match backend)
======================= */

type Resource = {
  id: string;
  name: string;
  category: string;
  description: string;
  availability: 'available' | 'unavailable';
  createdAt: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

/* =======================
   Resource Card
======================= */

function ResourceCard({ resource }: { resource: Resource }) {
  const isAvailable = resource.availability === 'available';

  return (
    <Link href={`/resources/${resource.id}`} className="block group">
      <div className="card-gradient h-full transition-transform duration-300 group-hover:scale-[1.02]">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {resource.name}
            </h3>
            <span className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold dark:bg-slate-800">
              📂 {resource.category}
            </span>
          </div>

          <span className="text-xl">
            {isAvailable ? '✅' : '❌'}
          </span>
        </div>

        <p className="mb-4 line-clamp-3 text-slate-600 dark:text-slate-300">
          {resource.description || 'No description provided.'}
        </p>

        <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>
            Added {new Date(resource.createdAt).toLocaleDateString()}
          </span>
          <span className="font-medium text-violet-600 dark:text-violet-400">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}

/* =======================
   Page Component
======================= */

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function loadResources() {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: '12',
      });

      if (search) params.set('search', search);
      if (category) params.set('category', category);

      try {
        const data = await api.get<{
          resources: Resource[];
          pagination: Pagination;
        }>(`/resources?${params.toString()}`);

        if (!cancelled) {
          setResources(data.resources);
          setPagination(data.pagination);
        }
      } catch {
        if (!cancelled) {
          setResources([]);
          setPagination(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadResources();
    return () => {
      cancelled = true;
    };
  }, [page, search, category]);

  /* =======================
     Render
  ======================= */

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header with Back Button */}
      <div className="mb-8">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300 transition-colors font-medium mb-6"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Campus Resources
        </h1>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <input
          type="search"
          placeholder="Search resources..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="input max-w-sm"
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="input max-w-xs"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-20 text-center">Loading resources…</div>
      )}

      {/* Empty */}
      {!loading && resources.length === 0 && (
        <div className="py-20 text-center text-slate-500">
          No resources found.
        </div>
      )}

      {/* Grid */}
      {!loading && resources.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {resources.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-10 flex justify-center gap-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="btn-secondary disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm text-slate-600 dark:text-slate-400">
                Page {pagination.page} of {pagination.pages}
              </span>

              <button
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => p + 1)}
                className="btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
