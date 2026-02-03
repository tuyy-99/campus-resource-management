'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthProvider';
import { Resource } from '@/types';

export default function EditResourcePage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const id = params.id as string;
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [availability, setAvailability] = useState<'available' | 'unavailable'>('available');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    api
      .get<Resource>(`/resources/${id}`)
      .then((data) => {
        if (!cancelled) {
          setName(data.name);
          setCategory(data.category);
          setDescription(data.description ?? '');
          setAvailability(data.availability);
        }
      })
      .catch(() => {
        if (!cancelled) setError('Resource not found.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, id]);

  if (authLoading || loading) {
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!name.trim() || !category.trim()) {
      setError('Name and category are required.');
      return;
    }
    setSubmitting(true);
    try {
      await api.patch(`/resources/${id}`, {
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        availability,
      });
      router.push('/admin/resources');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update resource.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-mesh-admin">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5" />
      
      <div className="relative mx-auto max-w-3xl px-6 py-12 sm:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-500 p-5 shadow-xl shadow-blue-500/30 float-animation">
            <span className="text-3xl">✏️</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            <span className="gradient-text-admin">Edit Resource</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Update resource information and availability status.
          </p>
          <Link
            href="/admin/resources"
            className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
          >
            ← Back to Resources
          </Link>
        </div>

        {/* Form */}
        <div className="card-admin">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 p-6 dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-800">
                <div className="flex items-center gap-3">
                  <span className="text-xl">⚠️</span>
                  <p className="text-red-600 dark:text-red-400 font-medium">
                    {error}
                  </p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                📝 Resource Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter resource name"
                className="input"
                required
                maxLength={200}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                📂 Category
              </label>
              <input
                id="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter category"
                className="input"
                required
                maxLength={100}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                📄 Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details about the resource..."
                className="input resize-none"
                maxLength={2000}
              />
            </div>

            <div>
              <label htmlFor="availability" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                🔄 Availability Status
              </label>
              <select
                id="availability"
                value={availability}
                onChange={(e) => setAvailability(e.target.value as 'available' | 'unavailable')}
                className="input"
              >
                <option value="available">✅ Available for requests</option>
                <option value="unavailable">❌ Currently unavailable</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-4 pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary text-base px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving Changes...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    💾 Save Changes
                  </span>
                )}
              </button>
              
              <Link
                href="/admin/resources"
                className="btn-secondary text-base px-8 py-4"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Resource Preview */}
        <div className="card-admin mt-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="text-xl">👁️</span>
            Preview
          </h2>
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 border border-slate-200 dark:border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {name || 'Resource Name'}
                </h3>
                <div className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:from-blue-900/40 dark:to-cyan-900/40 dark:text-blue-300">
                  📂 {category || 'Category'}
                </div>
              </div>
              <div className={`rounded-full p-2 ${
                availability === 'available' 
                  ? 'bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40' 
                  : 'bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/40 dark:to-pink-900/40'
              }`}>
                <span className="text-lg">
                  {availability === 'available' ? '✅' : '❌'}
                </span>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              {description || 'No description provided.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
