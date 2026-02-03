"use client";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { api } from "@/lib/api";

type SupportCategory = "technical" | "resource" | "account" | "general";

export default function SupportPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ 
    name: user?.name || "", 
    email: user?.email || "", 
    category: "general" as SupportCategory,
    subject: "",
    message: "" 
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: "technical", label: "🔧 Technical Issue", desc: "System bugs, login problems, errors" },
    { value: "resource", label: "📚 Resource Request", desc: "Questions about borrowing, availability" },
    { value: "account", label: "👤 Account Support", desc: "Profile, permissions, access issues" },
    { value: "general", label: "💬 General Inquiry", desc: "Other questions or feedback" }
  ];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    try {
      await api.post("/support", {
        ...form,
        fullMessage: `Category: ${form.category}\nSubject: ${form.subject}\n\n${form.message}`
      });
      
      setStatus("✅ Support request sent successfully! We'll get back to you soon.");
      setForm({ 
        ...form, 
        subject: "", 
        message: "",
        category: "general"
      });
    } catch (error) {
      setStatus("❌ Failed to send support request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-mesh-support">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />
      
      <div className="relative mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 p-5 shadow-xl shadow-purple-500/30 float-animation">
            <span className="text-3xl">🎧</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            <span className="gradient-text-support">Contact Support</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Need help? We're here to assist you with any questions or issues.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Quick Help */}
          <div className="lg:col-span-1">
            <div className="card-support sticky top-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span>⚡</span> Quick Help
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">📖 User Guide</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    Check our comprehensive guide for common questions.
                  </p>
                  <a href="/guide" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                    View Guide →
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">🕐 Response Time</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    We typically respond within 24 hours during business days.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">🚨 Urgent Issues</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    For critical system issues, mark as "Technical Issue" for priority handling.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Support Form */}
          <div className="lg:col-span-2">
            <div className="card-support">
              <form onSubmit={submit} className="space-y-6">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    What can we help you with?
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {categories.map((cat) => (
                      <label
                        key={cat.value}
                        className={`relative flex cursor-pointer rounded-xl border-2 p-4 transition-all ${
                          form.category === cat.value
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={cat.value}
                          checked={form.category === cat.value}
                          onChange={(e) => setForm({ ...form, category: e.target.value as SupportCategory })}
                          className="sr-only"
                        />
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">{cat.label}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">{cat.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Brief description of your issue"
                    className="input"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Please provide as much detail as possible..."
                    rows={6}
                    className="textarea resize-none"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 focus:ring-4 focus:ring-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    "Send Support Request"
                  )}
                </button>

                {/* Status Message */}
                {status && (
                  <div className={`p-4 rounded-xl text-center font-medium ${
                    status.includes("✅") 
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                      : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                  }`}>
                    {status}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
