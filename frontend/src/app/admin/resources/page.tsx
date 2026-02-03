'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthProvider';
import { Resource, Pagination } from '@/types';

function ResourceCard({ resource, onDelete }: { resource: Resource; onDelete: (id: string, name: string) => void }) {
  return (
    <div className="card-admin group hover:scale-105 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {resource.name}
          </h3>
          <div className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:from-blue-900/40 dark:to-cyan-900/40 dark:text-blue-300 mb-3">
            📂 {resource.category}
          </div>
        </div>
        <div className={`rounded-full p-2 ${
          resource.availability === 'available' 
            ? 'bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40' 
            : 'bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/40 dark:to-pink-900/40'
        }`}>
          <span className="text-lg">
            {resource.availability === 'available' ? '✅' : '❌'}
          </span>
        </div>
      </div>
      
      <p className="text-slate-600 dark:text-slate-300 mb-6 line-clamp-3">
        {resource.description || 'No description provided.'}
      </p>
      
      <div className="flex items-center justify-between text-sm mb-4">
        <div className="text-slate-500 dark:text-slate-400">
          Added {new Date(resource.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Link
          href={`/admin/resources/${resource.id}/edit`}
          className="btn-secondary text-sm flex-1 text-center"
        >
          ✏️ Edit
        </Link>
        <button
          onClick={() => onDelete(resource.id, resource.name)}
          className="btn-danger text-sm flex-1"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default function AdminResourcesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    api
      .get<{ resources: Resource[]; pagination: Pagination }>(`/resources?page=${page}&limit=12`)
      .then((data) => {
        if (!cancelled) {
          setResources(data.resources);
          setPagination(data.pagination);
        }
      })
      .catch(() => {
        if (!cancelled) setResources([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, page]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete resource "${name}"? This action cannot be undone.`)) return;
    try {
      await api.delete(`/resources/${id}`);
      setResources((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert('Failed to delete resource. Please try again.');
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }
  
  if (!user || user.role !== 'ADMIN') {
    router.replace('/login');
    return null;
  }

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-mesh-admin">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5" />
      
      <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-500 p-5 shadow-xl shadow-blue-500/30 float-animation">
            <span className="text-3xl">🛠️</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            <span className="gradient-text-admin">Resource Management</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Manage all campus resources, update availability, and organize your resource catalog.
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
          >
            ← Back to Admin Dashboard
          </Link>
        </div>

        {/* Actions Bar */}
        <div className="card-admin mb-12">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Resource Overview
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                {pagination ? `${pagination.total} total resources` : 'Loading resources...'}
              </p>
            </div>
            <Link
              href="/admin/resources/new"
              className="btn-primary text-base px-6 py-3 shadow-glow-admin"
            >
              ➕ Add New Resource
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="spinner" />
          </div>
        )}

        {/* Resources Grid */}
        {!loading && (
          <>
            {resources.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-6">📭</div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  No resources yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8">
                  Start building your resource catalog by adding the first resource.
                </p>
                <Link
                  href="/admin/resources/new"
                  className="btn-primary text-lg px-8 py-4"
                >
                  ➕ Add First Resource
                </Link>
              </div>
            ) : (
              <>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
                  {resources.map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page <= 1}
                      className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-10 h-10 rounded-xl font-semibold transition-all duration-200 ${
                              page === pageNum
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                                : 'bg-white/80 text-slate-700 hover:bg-blue-50 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-blue-900/20'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page >= pagination.pages}
                      className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Quick Stats */}
        {!loading && resources.length > 0 && (
          <div className="card-admin mt-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="text-xl">📊</span>
              Resource Statistics
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20">
                <div className="text-2xl mb-2">✅</div>
                <div className="text-lg font-semibold text-slate-900 dark:text-white">
                  {resources.filter(r => r.availability === 'available').length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Available</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
                <div className="text-2xl mb-2">❌</div>
                <div className="text-lg font-semibold text-slate-900 dark:text-white">
                  {resources.filter(r => r.availability === 'unavailable').length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Unavailable</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                <div className="text-2xl mb-2">📂</div>
                <div className="text-lg font-semibold text-slate-900 dark:text-white">
                  {new Set(resources.map(r => r.category)).size}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Categories</div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
                <div className="text-2xl mb-2">📚</div>
                <div className="text-lg font-semibold text-slate-900 dark:text-white">
                  {pagination?.total || resources.length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Total Resources</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
 
