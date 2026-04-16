"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface PublishButtonProps {
  siteId: string;
}

export function PublishButton({ siteId }: PublishButtonProps) {
  const [loading, setLoading] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handlePublish() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/sites/${siteId}/publish`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to publish");
      setPublishedUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (publishedUrl) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-4 flex flex-col gap-2">
        <p className="text-sm font-semibold text-green-800">Site published!</p>
        <a
          href={publishedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-green-700 underline break-all"
        >
          {publishedUrl}
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button size="lg" onClick={handlePublish} loading={loading}>
        Publish site
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
