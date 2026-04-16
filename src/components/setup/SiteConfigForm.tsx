"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { toSlug } from "@/lib/utils/slug";

interface SiteConfigFormProps {
  siteId: string;
  title: string;
  slug: string;
  onTitleChange: (title: string) => void;
  onSlugChange: (slug: string) => void;
}

export function SiteConfigForm({
  siteId,
  title,
  slug,
  onTitleChange,
  onSlugChange,
}: SiteConfigFormProps) {
  const [localTitle, setLocalTitle] = useState(title);
  const [localSlug, setLocalSlug] = useState(slug);
  const [slugError, setSlugError] = useState("");
  const [slugChecking, setSlugChecking] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  useEffect(() => {
    setLocalSlug(slug);
  }, [slug]);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setLocalTitle(val);
    onTitleChange(val);
    // Auto-derive slug from title
    const derived = toSlug(val);
    setLocalSlug(derived);
    checkSlug(derived, siteId);
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = toSlug(e.target.value);
    setLocalSlug(val);
    checkSlug(val, siteId);
  }

  function checkSlug(value: string, id: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!value) return;
      setSlugChecking(true);
      try {
        const res = await fetch(`/api/sites/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: value }),
        });
        if (res.status === 409) {
          setSlugError("This URL is already taken");
        } else if (res.ok) {
          setSlugError("");
          onSlugChange(value);
        }
      } catch {
        // ignore network errors in preview
      } finally {
        setSlugChecking(false);
      }
    }, 600);
  }

  async function saveTitle() {
    if (!localTitle.trim()) return;
    await fetch(`/api/sites/${siteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: localTitle }),
    });
    onTitleChange(localTitle);
  }

  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "localhost:3000";
  const isLocalhost = appDomain.startsWith("localhost");
  const urlPreview = isLocalhost
    ? `${appDomain}/s/${localSlug}`
    : `${localSlug}.${appDomain}`;

  return (
    <div className="flex flex-col gap-4">
      <Input
        id="site-title"
        label="Site title"
        value={localTitle}
        onChange={handleTitleChange}
        onBlur={saveTitle}
        placeholder="My Notion Site"
      />
      <div className="flex flex-col gap-1">
        <Input
          id="site-slug"
          label="URL slug"
          value={localSlug}
          onChange={handleSlugChange}
          error={slugError}
          placeholder="my-notion-site"
        />
        <p className="text-xs text-gray-500">
          {slugChecking ? "Checking..." : `Your site: ${urlPreview}`}
        </p>
      </div>
    </div>
  );
}
