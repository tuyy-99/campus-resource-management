'use client';

import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden bg-mesh">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-32 sm:px-8 sm:pt-32 sm:pb-40">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-pink-500/10 pointer-events-none" />
        
        <div className="relative text-center">
          <div className="float-animation mb-8">
            <div className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-r from-violet-500 to-purple-500 p-6 shadow-2xl shadow-violet-500/30">
              <span className="text-4xl">🏫</span>
            </div>
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl md:text-7xl">
            <span className="gradient-text">Campus Resource</span>
            <br />
            <span className="text-slate-700 dark:text-slate-300">Management</span>
          </h1>
          
          <p className="mx-auto mt-8 max-w-3xl text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
            Streamline your campus experience with our modern resource management platform. 
            Browse resources, submit requests, and manage everything seamlessly in one beautiful interface.
          </p>
          
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
            {!user ? (
              <>
                <Link
                  href="/resources"
                  className="btn-primary text-lg px-10 py-4 shadow-glow"
                >
                  🔍 Explore Resources
                </Link>
                <Link
                  href="/register"
                  className="btn-accent text-lg px-10 py-4"
                >
                  🚀 Get Started
                </Link>
                <Link
                  href="/login"
                  className="btn-secondary text-lg px-10 py-4"
                >
                  👋 Sign In
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                  className={user.role === 'ADMIN' ? 'btn-primary text-lg px-10 py-4 shadow-glow-admin' : 'btn-primary text-lg px-10 py-4 shadow-glow'}
                >
                  {user.role === 'ADMIN' ? '⚡ Admin Dashboard' : '📊 My Dashboard'}
                </Link>
                <Link
                  href="/resources"
                  className="btn-secondary text-lg px-10 py-4"
                >
                  📚 Browse Resources
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative border-t border-slate-200/60 bg-white/80 backdrop-blur-xl py-24 dark:border-slate-800/60 dark:bg-slate-900/80">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="mt-4 text-xl text-slate-600 dark:text-slate-300">
              Simple, efficient, and designed for modern campus life
            </p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card-gradient text-center group hover:scale-105 transition-transform duration-300">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-4 mb-6 shadow-lg shadow-blue-500/25">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Browse Resources
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Discover available campus resources with our intuitive search and filtering system.
              </p>
            </div>
            
            <div className="card-gradient text-center group hover:scale-105 transition-transform duration-300">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 p-4 mb-6 shadow-lg shadow-violet-500/25">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Submit Requests
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Request resources with just a few clicks and track your submissions in real-time.
              </p>
            </div>
            
            <div className="card-gradient text-center group hover:scale-105 transition-transform duration-300">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-4 mb-6 shadow-lg shadow-emerald-500/25">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Instant Updates
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Get notified immediately when your requests are approved or need attention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-pink-600/10">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">500+</div>
              <div className="text-slate-600 dark:text-slate-300">Resources Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">1,200+</div>
              <div className="text-slate-600 dark:text-slate-300">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">98%</div>
              <div className="text-slate-600 dark:text-slate-300">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">24/7</div>
              <div className="text-slate-600 dark:text-slate-300">System Availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="relative py-24 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 dark:from-violet-700 dark:via-purple-700 dark:to-pink-700">
          <div className="absolute inset-0 bg-white/10 dark:bg-black/20" />
          <div className="relative mx-auto max-w-4xl px-6 sm:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-violet-100 dark:text-violet-200 mb-10">
              Join thousands of students already using our platform to manage their campus resources efficiently.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link
                href="/register"
                className="bg-white text-violet-600 hover:bg-violet-50 dark:bg-slate-100 dark:text-violet-700 dark:hover:bg-white font-semibold px-10 py-4 rounded-2xl text-lg transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Create Account
              </Link>
              <Link
                href="/login"
                className="border-2 border-white text-white hover:bg-white hover:text-violet-600 dark:border-slate-200 dark:hover:bg-slate-200 dark:hover:text-violet-700 font-semibold px-10 py-4 rounded-2xl text-lg transition-all duration-300 hover:scale-105"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Need Help Section */}
      <section className="relative py-24 bg-mesh-support">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />
        
        <div className="relative mx-auto max-w-4xl px-6 sm:px-8 text-center">
          <div className="mb-8">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 p-4 mb-6 shadow-xl shadow-amber-500/30 float-animation">
              <span className="text-2xl">💡</span>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Need Help?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
            If you have questions about requesting resources or need assistance with the platform, don't hesitate to reach out to our support team.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/support"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-teal-500/25"
            >
              <span>🎧</span>
              Contact Support
            </Link>
            <Link
              href="/guide"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-blue-500/25"
            >
              <span>📚</span>
              View Guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}