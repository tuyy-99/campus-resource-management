'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthProvider';
import { ResourceRequest } from '@/types';

function getResourceName(r: ResourceRequest): string {
  const res = r.resourceId;
  return typeof res === 'object' && res !== null && 'name' in res ? String((res as { name: string }).name) : '—';
}

function StatusBadge({ status }: { status: string }) {
  const className = status === 'approved' ? 'status-approved' : 
                   status === 'rejected' ? 'status-rejected' : 'status-pending';
  
  const icon = status === 'approved' ? '✅' : 
               status === 'rejected' ? '❌' : '⏳';
  
  return (
    <span className={className}>
      {icon} {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function UserDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState<ResourceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    if (user.role === 'ADMIN') {
      router.replace('/admin');
      return;
    }
    let cancelled = false;
    setLoading(true);
    api
      .get<{ requests: ResourceRequest[] }>('/requests?limit=5')
      .then((data) => {
        if (!cancelled) setRequests(data.requests);
      })
      .catch(() => {
        if (!cancelled) setRequests([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }
  if (!user) {
    router.replace('/login');
    return null;
  }

  const pending = requests.filter((r) => r.status === 'pending').length;
  const approved = requests.filter((r) => r.status === 'approved').length;
  const rejected = requests.filter((r) => r.status === 'rejected').length;

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-mesh">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-pink-500/5" />
      
      <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8">
        {/* Welcome Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-gradient-to-r from-violet-500 to-purple-500 p-5 shadow-xl shadow-violet-500/30 float-animation">
            <span className="text-3xl">👋</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Welcome back, <span className="gradient-text">{user.name}</span>!
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Here's an overview of your resource requests and quick actions.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <div className="card-gradient text-center group hover:scale-105 transition-transform duration-300">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-3 mb-4 shadow-lg shadow-amber-500/25">
              <span className="text-xl">⏳</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{pending}</div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-300">Pending Requests</div>
          </div>
          
          <div className="card-gradient text-center group hover:scale-105 transition-transform duration-300">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-3 mb-4 shadow-lg shadow-emerald-500/25">
              <span className="text-xl">✅</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{approved}</div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-300">Approved Requests</div>
          </div>
          
          <div className="card-gradient text-center group hover:scale-105 transition-transform duration-300">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 p-3 mb-4 shadow-lg shadow-red-500/25">
              <span className="text-xl">❌</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{rejected}</div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-300">Rejected Requests</div>
          </div>
          
          <div className="card-gradient text-center group hover:scale-105 transition-transform duration-300">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-3 mb-4 shadow-lg shadow-blue-500/25">
              <span className="text-xl">📊</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{requests.length}</div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Requests</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-8 lg:grid-cols-2 mb-12">
          <div className="card-gradient">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="text-2xl">🚀</span>
              Quick Actions
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/resources"
                className="group p-6 rounded-2xl bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 hover:from-violet-200 hover:to-purple-200 dark:hover:from-violet-900/50 dark:hover:to-purple-900/50 transition-all duration-300 hover:scale-105"
              >
                <div className="text-2xl mb-3">📚</div>
                <div className="font-semibold text-slate-900 dark:text-white mb-2">Browse Resources</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Discover available campus resources</div>
              </Link>
              
              <Link
                href="/requests"
                className="group p-6 rounded-2xl bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 hover:from-blue-200 hover:to-cyan-200 dark:hover:from-blue-900/50 dark:hover:to-cyan-900/50 transition-all duration-300 hover:scale-105"
              >
                <div className="text-2xl mb-3">📋</div>
                <div className="font-semibold text-slate-900 dark:text-white mb-2">View All Requests</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Manage your resource requests</div>
              </Link>
            </div>
          </div>

          {/* Recent Requests */}
          <div className="card-gradient">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <span className="text-2xl">📝</span>
                Recent Requests
              </h2>
              <Link
                href="/requests"
                className="text-sm font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300 transition-colors"
              >
                View All →
              </Link>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="spinner" />
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📭</div>
                <p className="text-slate-600 dark:text-slate-400 mb-4">No requests yet</p>
                <Link
                  href="/resources"
                  className="btn-primary text-sm"
                >
                  Browse Resources
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.slice(0, 3).map((request) => (
                  <div
                    key={request.id}
                    className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {getResourceName(request)}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <StatusBadge status={request.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="card-gradient text-center">
          <div className="text-3xl mb-4">💡</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Need Help?
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
            If you have questions about requesting resources or need assistance with the platform, 
            don't hesitate to reach out to our support team.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/support"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-violet-600 hover:to-purple-600 focus:ring-4 focus:ring-violet-500/25 transition-all duration-300 shadow-lg shadow-violet-500/25"
            >
              <span>🎧</span>
              Contact Support
            </Link>
            <Link
              href="/guide"
              className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold py-3 px-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 focus:ring-4 focus:ring-slate-500/25 transition-all duration-300"
            >
              <span>📖</span>
              View Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

