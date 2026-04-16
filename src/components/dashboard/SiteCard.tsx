"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface Site {
  id: string;
  title: string;
  slug: string;
  theme: string;
  published: boolean;
  publishedAt: Date | null;
  _count: { pages: number };
}

interface SiteCardProps {
  site: Site;
  appDomain: string;
  onDelete: (id: string) => void;
}

export function SiteCard({ site, appDomain, onDelete }: SiteCardProps) {
  const [deleting, setDeleting] = useState(false);

  const isLocalhost = appDomain.startsWith("localhost");
  const publishedUrl = site.published
    ? isLocalhost
      ? `http://${appDomain}/s/${site.slug}`
      : `https://${site.slug}.${appDomain}`
    : null;

  async function handleDelete() {
    if (!confirm(`Delete "${site.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    await fetch(`/api/sites/${site.id}`, { method: "DELETE" });
    onDelete(site.id);
  }

  const THEME_LABELS: Record<string, string> = {
    minimal: "Minimal",
    docs: "Documentation",
    showcase: "Showcase",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{site.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {THEME_LABELS[site.theme] ?? site.theme} ·{" "}
            {site._count.pages} page{site._count.pages !== 1 ? "s" : ""}
          </p>
        </div>
        <span
          className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
            site.published
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {site.published ? "Live" : "Draft"}
        </span>
      </div>

      {publishedUrl && (
        <a
          href={publishedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-indigo-600 hover:underline truncate"
        >
          {publishedUrl}
        </a>
      )}

      <div className="flex gap-2 pt-1">
        <Link href={`/setup/${site.id}`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full">
            Edit
          </Button>
        </Link>
        {publishedUrl && (
          <a href={publishedUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="secondary" size="sm" className="w-full">
              View
            </Button>
          </a>
        )}
        <Button
          variant="ghost"
          size="sm"
          loading={deleting}
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
