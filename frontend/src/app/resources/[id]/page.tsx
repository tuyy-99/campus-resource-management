'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from "@/components/ui/Toast";
import { Resource } from "@/types";

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const push = useToast();

  useEffect(() => {
    let cancelled = false;
    api
      .get<Resource>(`/resources/${id}`)
      .then((data) => {
        if (!cancelled) setResource(data);
      })
      .catch(() => {
        if (!cancelled) setResource(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleRequest() {
    if (!user) {
      router.push("/login");
      return;
    }
    setError("");
    setSuccess(false);
    setRequesting(true);
    try {
      await api.post("/requests", { resourceId: id });
      setSuccess(true);
      push("Request submitted — waiting for admin review");
      setTimeout(() => router.push("/requests"), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setRequesting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-mesh">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-pink-500/5" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
          <div className="text-6xl mb-6">❓</div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Resource Not Found
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            The resource you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/resources" className="btn-primary text-lg px-8 py-4">
            ← Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-mesh">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-pink-500/5" />

      <div className="relative mx-auto max-w-4xl px-6 py-12 sm:px-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300 font-medium transition-colors"
          >
            ← Back to Resources
          </Link>
        </div>

        {/* Resource Details */}
        <div className="card-gradient">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 px-4 py-2 text-sm font-semibold text-blue-800 dark:from-blue-900/40 dark:to-cyan-900/40 dark:text-blue-300 mb-4">
                📂 {resource.category}
              </div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                {resource.name}
              </h1>
              <div className="text-slate-500 dark:text-slate-400">
                Added on {new Date(resource.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div
              className={`rounded-2xl p-4 ${
                resource.availability === "available"
                  ? "bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40"
                  : "bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/40 dark:to-pink-900/40"
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">
                  {resource.availability === "available" ? "✅" : "❌"}
                </div>
                <div
                  className={`text-sm font-semibold ${
                    resource.availability === "available"
                      ? "text-emerald-800 dark:text-emerald-300"
                      : "text-red-800 dark:text-red-300"
                  }`}
                >
                  {resource.availability === "available"
                    ? "Available"
                    : "Unavailable"}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {resource.description && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="text-xl">📄</span>
                Description
              </h2>
              <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {resource.description}
                </p>
              </div>
            </div>
          )}

          {/* Request Section */}
          <div className="border-t border-slate-200/60 dark:border-slate-700/60 pt-8">
            {success ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Request Submitted Successfully!
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Your request has been sent to the administrators for review.
                  You'll be redirected to your requests page shortly.
                </p>
                <Link
                  href="/requests"
                  className="btn-primary text-lg px-8 py-4"
                >
                  View My Requests
                </Link>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="text-xl">📝</span>
                  Request This Resource
                </h2>

                {error && (
                  <div className="mb-6 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 p-6 dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-800">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">⚠️</span>
                      <p className="text-red-600 dark:text-red-400 font-medium">
                        {error}
                      </p>
                    </div>
                  </div>
                )}

                {resource.availability === "available" ? (
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="text-2xl">ℹ️</div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                          Ready to request this resource?
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">
                          Your request will be sent to administrators for
                          review. You'll receive updates on the status of your
                          request.
                        </p>
                        {!user && (
                          <p className="text-sm text-violet-600 dark:text-violet-400 mb-4">
                            You need to be signed in to submit a request.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {user ? (
                        <button
                          onClick={handleRequest}
                          disabled={requesting}
                          className="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {requesting ? (
                            <span className="flex items-center gap-2">
                              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              Submitting Request...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              📝 Submit Request
                            </span>
                          )}
                        </button>
                      ) : (
                        <Link
                          href="/login"
                          className="btn-primary text-lg px-8 py-4"
                        >
                          Sign In to Request
                        </Link>
                      )}

                      <Link
                        href="/resources"
                        className="btn-secondary text-lg px-8 py-4"
                      >
                        Browse More Resources
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800">
                    <div className="flex items-start gap-4">
                      <div className="text-2xl">❌</div>
                      <div>
                        <h3 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                          Resource Currently Unavailable
                        </h3>
                        <p className="text-red-600 dark:text-red-400 mb-4">
                          This resource is not available for requests at the
                          moment. Please check back later or contact
                          administrators for more information.
                        </p>
                        <Link href="/resources" className="btn-secondary">
                          Browse Available Resources
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
 
