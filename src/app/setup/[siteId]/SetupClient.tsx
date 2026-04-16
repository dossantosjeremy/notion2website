"use client";

import { useState } from "react";
import { ThemePicker } from "@/components/setup/ThemePicker";
import { SiteConfigForm } from "@/components/setup/SiteConfigForm";
import { PublishButton } from "@/components/setup/PublishButton";
import type { Theme } from "@/lib/types/notion";
import Link from "next/link";

interface Page {
  id: string;
  title: string;
  depth: number;
  slug: string;
  parentPageId: string | null;
}

interface Site {
  id: string;
  title: string;
  slug: string;
  theme: string;
  themeSuggested: string | null;
  published: boolean;
  pages: Page[];
}

interface SetupClientProps {
  site: Site;
}

export function SetupClient({ site }: SetupClientProps) {
  const [theme, setTheme] = useState<Theme>(site.theme as Theme);
  const [title, setTitle] = useState(site.title);
  const [slug, setSlug] = useState(site.slug);

  async function handleThemeChange(newTheme: Theme) {
    setTheme(newTheme);
    await fetch(`/api/sites/${site.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: newTheme }),
    });
  }

  const pageCount = site.pages.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-gray-900 text-sm">
          ← notion2website
        </Link>
        <span className="text-xs text-gray-400">
          {pageCount} page{pageCount !== 1 ? "s" : ""} imported
        </span>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-8">
        {/* Step indicator */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configure your site</h1>
          <p className="text-sm text-gray-500 mt-1">
            Customize the look and URL, then publish.
          </p>
        </div>

        {/* Theme section */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <ThemePicker
            selected={theme}
            suggested={site.themeSuggested as Theme | null}
            onSelect={handleThemeChange}
          />
        </section>

        {/* Config section */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Site settings</h2>
          <SiteConfigForm
            siteId={site.id}
            title={title}
            slug={slug}
            onTitleChange={setTitle}
            onSlugChange={setSlug}
          />
        </section>

        {/* Pages preview */}
        {pageCount > 1 && (
          <section className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              Pages ({pageCount})
            </h2>
            <ul className="flex flex-col gap-1">
              {site.pages.slice(0, 10).map((page) => (
                <li
                  key={page.id}
                  className="flex items-center gap-2 text-sm text-gray-600"
                  style={{ paddingLeft: `${page.depth * 16}px` }}
                >
                  <span className="text-gray-300">{"›".repeat(page.depth || 1)}</span>
                  {page.title}
                </li>
              ))}
              {pageCount > 10 && (
                <li className="text-xs text-gray-400 mt-1">
                  +{pageCount - 10} more pages
                </li>
              )}
            </ul>
          </section>
        )}

        {/* Publish */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Publish</h2>
          <PublishButton siteId={site.id} />
        </section>
      </div>
    </div>
  );
}
