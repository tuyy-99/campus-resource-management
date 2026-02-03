"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { School, X } from "lucide-react";

export function Nav() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  const navLinkStyle = (href: string) =>
    `block rounded-xl px-4 py-3 text-base font-medium transition ${
      pathname === href
        ? isAdmin
          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
          : "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
    }`;

  // lock scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      {/* TOP NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/60 bg-white/90 backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                isAdmin ? "bg-blue-600" : "bg-violet-600"
              }`}
            >
              <School className="h-5 w-5 text-white" />
            </div>
            <span className="hidden sm:block">Campus Resources</span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/">Home</Link>
            {!loading && user && (
              <>
                {isAdmin ? (
                  <Link href="/admin">Admin</Link>
                ) : (
                  <Link href="/dashboard">Dashboard</Link>
                )}
                <Link href="/resources">Resources</Link>
                <Link href="/requests">Requests</Link>
              </>
            )}
            {!loading && !user && (
              <>
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
              </>
            )}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            {/* User Menu for Desktop */}
            {!loading && user && (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Welcome, {user.name}
                </span>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <span>🚪</span>
                  Logout
                </button>
              </div>
            )}
            
            <ThemeToggle />

            {/* Hamburger */}
            <button
              onClick={() => setOpen(true)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* BACKDROP */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* SLIDE MENU */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-slate-900 shadow-xl transform transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
          <span className="font-semibold">Menu</span>
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          <Link href="/" className={navLinkStyle("/")}>
            🏠 Home
          </Link>

          {!loading && user && (
            <>
              {isAdmin ? (
                <Link href="/admin" className={navLinkStyle("/admin")}>
                  ⚡ Admin
                </Link>
              ) : (
                <Link href="/dashboard" className={navLinkStyle("/dashboard")}>
                  📊 Dashboard
                </Link>
              )}
              <Link href="/resources" className={navLinkStyle("/resources")}>
                📚 Resources
              </Link>
              <Link href="/requests" className={navLinkStyle("/requests")}>
                📋 Requests
              </Link>

              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="text-left rounded-xl px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Logout
              </button>
            </>
          )}

          {!loading && !user && (
            <>
              <Link href="/login" className={navLinkStyle("/login")}>
                🔑 Login
              </Link>
              <Link href="/register" className={navLinkStyle("/register")}>
                📝 Register
              </Link>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
