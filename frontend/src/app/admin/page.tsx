'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { api } from '@/lib/api';

interface AdminStats {
  users: number;
  resources: number;
  requests: number;
  pending: number;
  supportTickets: number;
  openTickets: number;
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'error';
  uptime: string;
  lastUpdated: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    status: 'healthy',
    uptime: '99.9%',
    lastUpdated: new Date().toLocaleString()
  });
  const [recentActivity, setRecentActivity] = useState<Array<{
    id: string;
    type: 'request' | 'resource' | 'user';
    action: string;
    timestamp: string;
    user?: string;
  }>>([]);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') return;
    
    const fetchData = async () => {
      try {
        // Fetch admin overview stats
        const overviewRes = await api.get<AdminStats>('/admin/overview');
        setStats(overviewRes);

        // Simulate recent activity (in a real app, this would come from an API)
        setRecentActivity([
          {
            id: '1',
            type: 'request',
            action: 'New resource request submitted',
            timestamp: '2 minutes ago',
            user: 'John Doe'
          },
          {
            id: '2',
            type: 'resource',
            action: 'Resource "Laptop Dell XPS" updated',
            timestamp: '15 minutes ago',
            user: 'Admin'
          },
          {
            id: '3',
            type: 'request',
            action: 'Request approved for "Projector"',
            timestamp: '1 hour ago',
            user: 'Admin'
          },
          {
            id: '4',
            type: 'user',
            action: 'New user registered',
            timestamp: '2 hours ago',
            user: 'Jane Smith'
          }
        ]);

        // Update system health
        setSystemHealth({
          status: 'healthy',
          uptime: '99.9%',
          lastUpdated: new Date().toLocaleString()
        });
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
        setSystemHealth(prev => ({ ...prev, status: 'warning' }));
      }
    };

    fetchData();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [user]);

  if (authLoading) return <div className="mx-auto max-w-4xl px-4 py-12">Loading…</div>;
  if (!user || user.role !== 'ADMIN') {
    router.replace('/login');
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-emerald-600 dark:text-emerald-400';
      case 'warning': return 'text-amber-600 dark:text-amber-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'request': return '📋';
      case 'resource': return '📚';
      case 'user': return '👤';
      default: return '📝';
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-mesh-admin">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5" />
      
      <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8">
        {/* Admin Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-500 p-5 shadow-xl shadow-blue-500/30 float-animation">
            <span className="text-3xl">⚡</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            <span className="gradient-text-admin">Admin Dashboard</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Manage resources, review requests, and oversee campus operations.
          </p>
        </div>

        {/* System Health Status */}
        <div className="card-admin mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🔍</span> System Health
            </h2>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                systemHealth.status === 'healthy' ? 'bg-emerald-500' :
                systemHealth.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
              }`} />
              <span className={`font-semibold ${getStatusColor(systemHealth.status)}`}>
                {systemHealth.status.charAt(0).toUpperCase() + systemHealth.status.slice(1)}
              </span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="text-center p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-lg font-semibold text-slate-900 dark:text-white">{systemHealth.uptime}</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">Uptime</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <div className="text-2xl mb-2">🔄</div>
              <div className="text-lg font-semibold text-slate-900 dark:text-white">Real-time</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">Updates</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <div className="text-2xl mb-2">🕐</div>
              <div className="text-lg font-semibold text-slate-900 dark:text-white">Live</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">Last Updated: {systemHealth.lastUpdated}</div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-12">
            <div className="card-admin text-center group hover:scale-105 transition-transform duration-300">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 p-3 mb-4 shadow-lg shadow-blue-500/25">
                <span className="text-xl">📚</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{stats.resources}</div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Resources</div>
            </div>
            
            <div className="card-admin text-center group hover:scale-105 transition-transform duration-300">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 p-3 mb-4 shadow-lg shadow-indigo-500/25">
                <span className="text-xl">📋</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{stats.requests}</div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Requests</div>
            </div>
            
            <div className="card-admin text-center group hover:scale-105 transition-transform duration-300">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-3 mb-4 shadow-lg shadow-amber-500/25">
                <span className="text-xl">⏳</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{stats.pending}</div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-300">Pending Requests</div>
            </div>
            
            <div className="card-admin text-center group hover:scale-105 transition-transform duration-300">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-3 mb-4 shadow-lg shadow-emerald-500/25">
                <span className="text-xl">👥</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{stats.users}</div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Users</div>
            </div>
            
            <div className="card-admin text-center group hover:scale-105 transition-transform duration-300">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 p-3 mb-4 shadow-lg shadow-pink-500/25">
                <span className="text-xl">🎧</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{stats.openTickets}</div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-300">Open Tickets</div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3 mb-12">
          {/* Admin Actions */}
          <div className="lg:col-span-2">
            <div className="card-admin">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <span className="text-2xl">🛠️</span>
                Quick Actions
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/admin/resources"
                  className="group flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 hover:from-blue-200 hover:to-indigo-200 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">📚</div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Manage Resources</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">View and organize</div>
                    </div>
                  </div>
                  <div className="text-blue-600 dark:text-blue-400">→</div>
                </Link>
                
                <Link
                  href="/admin/resources/new"
                  className="group flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 hover:from-emerald-200 hover:to-teal-200 dark:hover:from-emerald-900/50 dark:hover:to-teal-900/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">➕</div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Add Resource</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">Create new item</div>
                    </div>
                  </div>
                  <div className="text-emerald-600 dark:text-emerald-400">→</div>
                </Link>
                
                <Link
                  href="/requests"
                  className="group flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">📝</div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Review Requests</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">Approve/reject</div>
                    </div>
                  </div>
                  <div className="text-purple-600 dark:text-purple-400">→</div>
                </Link>
                
                <Link
                  href="/admin/support"
                  className="group flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 hover:from-amber-200 hover:to-orange-200 dark:hover:from-amber-900/50 dark:hover:to-orange-900/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">🎧</div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Support Tickets</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">Manage tickets</div>
                    </div>
                  </div>
                  <div className="text-amber-600 dark:text-amber-400">→</div>
                </Link>
              </div>

              {/* Urgent Notifications */}
              {stats && (stats.pending > 0 || stats.openTickets > 0) && (
                <div className="mt-6 space-y-3">
                  {stats.pending > 0 && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center gap-3">
                        <div className="text-xl">⚠️</div>
                        <div>
                          <div className="font-semibold text-amber-800 dark:text-amber-300">
                            {stats.pending} requests need your attention
                          </div>
                          <div className="text-sm text-amber-600 dark:text-amber-400">
                            Review pending requests to keep operations running smoothly
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {stats.openTickets > 0 && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border border-pink-200 dark:border-pink-800">
                      <div className="flex items-center gap-3">
                        <div className="text-xl">🎧</div>
                        <div>
                          <div className="font-semibold text-pink-800 dark:text-pink-300">
                            {stats.openTickets} support tickets awaiting response
                          </div>
                          <div className="text-sm text-pink-600 dark:text-pink-400">
                            Users are waiting for help with their issues
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className="card-admin">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span>📊</span> Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50">
                    <div className="text-lg">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {activity.action}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {activity.user && `by ${activity.user} • `}{activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="card-admin">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="text-2xl">📈</span>
            Performance Metrics
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-lg font-semibold text-slate-900 dark:text-white">
                {stats ? Math.round(((stats.requests - stats.pending) / Math.max(stats.requests, 1)) * 100) : 0}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">Processing Rate</div>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-lg font-semibold text-slate-900 dark:text-white">
                {stats ? Math.round((stats.resources / Math.max(stats.users, 1)) * 10) / 10 : 0}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">Resources per User</div>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-lg font-semibold text-slate-900 dark:text-white">
                {systemHealth.status === 'healthy' ? 'Optimal' : 'Monitoring'}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">System Performance</div>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50">
              <div className="text-2xl mb-2">🔄</div>
              <div className="text-lg font-semibold text-slate-900 dark:text-white">Live</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">Data Sync</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
