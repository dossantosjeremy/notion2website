"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteCard } from "@/components/dashboard/SiteCard";

interface Site {
  id: string;
  title: string;
  slug: string;
  theme: string;
  published: boolean;
  publishedAt: Date | null;
  _count: { pages: number };
}

interface DashboardClientProps {
  sites: Site[];
  appDomain: string;
}

export function DashboardClient({ sites: initialSites, appDomain }: DashboardClientProps) {
  const [sites, setSites] = useState(initialSites);

  function handleDelete(id: string) {
    setSites((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-gray-900 text-sm">
          notion2website
        </Link>
        <Link href="/api/auth/signout" className="text-xs text-gray-400 hover:text-gray-600">
          Sign out
        </Link>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My sites</h1>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            + New site
          </Link>
        </div>

        {sites.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500 text-sm">No sites yet.</p>
            <Link href="/" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
              Create your first site →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sites.map((site) => (
              <SiteCard
                key={site.id}
                site={site}
                appDomain={appDomain}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
