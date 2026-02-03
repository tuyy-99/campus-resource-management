"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";
import { ResourceRequest, Pagination } from "@/types";

/* ---------------- helpers ---------------- */

function getResourceName(r: ResourceRequest): string {
  const res = r.resourceId;
  return typeof res === "object" && res && "name" in res
    ? String(res.name)
    : "—";
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved: "✅ Approved",
    rejected: "❌ Rejected",
    pending: "⏳ Pending",
  };
  return <span className="text-sm font-semibold">{map[status] ?? status}</span>;
}

/* ---------------- actions ---------------- */

function RequestActions({
  id,
  onUpdate,
}: {
  id: string;
  onUpdate: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function act(type: "approve" | "reject") {
    setLoading(true);
    try {
      await api.post(`/requests/${id}/${type}`);
      onUpdate();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => act("approve")}
        disabled={loading}
        className="btn-success text-sm"
      >
        Approve
      </button>
      <button
        onClick={() => act("reject")}
        disabled={loading}
        className="btn-danger text-sm"
      >
        Reject
      </button>
    </div>
  );
}

/* ---------------- card ---------------- */

function RequestCard({
  request,
  isAdmin,
  onUpdate,
}: {
  request: ResourceRequest;
  isAdmin: boolean;
  onUpdate: () => void;
}) {
  return (
    <div className="card-gradient">
      <div className="flex justify-between mb-2">
        <h3 className="font-semibold">{getResourceName(request)}</h3>
        <StatusBadge status={request.status} />
      </div>

      <p className="text-sm text-slate-500">
        {new Date(request.createdAt).toLocaleString()}
      </p>

      {isAdmin && request.status === "pending" && (
        <div className="mt-4">
          <RequestActions id={request.id} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
}

/* ---------------- page ---------------- */

export default function RequestsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [requests, setRequests] = useState<ResourceRequest[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (!user) return;

    const params = new URLSearchParams({
      page: String(page),
      limit: "10",
    });

    if (status) params.set("status", status);

    setLoading(true);
    api
      .get<{ requests: ResourceRequest[]; pagination: Pagination }>(
        `/requests?${params}`,
      )
      .then((res) => {
        setRequests(res.requests);
        setPagination(res.pagination);
      })
      .finally(() => setLoading(false));
  }, [user, page, status]);

  if (authLoading) return null;
  if (!user) {
    router.replace("/login");
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {isAdmin ? "All Requests" : "My Requests"}
        </h1>

        {isAdmin && (
          <Link href="/admin" className="text-blue-500 text-sm">
            ← Back to admin
          </Link>
        )}
      </div>

      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
          setPage(1);
        }}
        className="input mb-6"
      >
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>

      {loading ? (
        <div>Loading…</div>
      ) : requests.length === 0 ? (
        <div>No requests found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((r) => (
            <RequestCard
              key={r.id}
              request={r}
              isAdmin={isAdmin}
              onUpdate={() => setPage(1)}
            />
          ))}
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <div className="mt-8 flex gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="btn-secondary"
          >
            Prev
          </button>
          <span>
            Page {page} of {pagination.pages}
          </span>
          <button
            disabled={page === pagination.pages}
            onClick={() => setPage(page + 1)}
            className="btn-secondary"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
