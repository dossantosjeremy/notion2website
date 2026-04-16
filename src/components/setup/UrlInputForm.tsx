"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { extractPageId } from "@/lib/notion/extract-page-id";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function UrlInputForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate(value: string): boolean {
    if (!value.trim()) {
      setError("Please enter a Notion page URL");
      return false;
    }
    const id = extractPageId(value);
    if (!id) {
      setError("That doesn't look like a valid Notion page URL");
      return false;
    }
    setError("");
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate(url)) return;

    if (!session) {
      // Store URL in sessionStorage then trigger OAuth
      sessionStorage.setItem("pendingNotionUrl", url);
      await signIn("notion", {
        callbackUrl: `/setup/callback?url=${encodeURIComponent(url)}`,
      });
      return;
    }

    // Already logged in — go straight to fetch
    setLoading(true);
    try {
      const res = await fetch("/api/notion/fetch-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notionPageUrl: url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch pages");
      router.push(`/setup/${data.siteId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xl">
      <Input
        id="notion-url"
        label="Notion page URL"
        type="url"
        placeholder="https://www.notion.so/My-Page-..."
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          if (error) validate(e.target.value);
        }}
        error={error}
        disabled={loading}
      />
      <Button type="submit" size="lg" loading={loading}>
        {session ? "Fetch & create site" : "Connect Notion & continue"}
      </Button>
      {!session && (
        <p className="text-xs text-gray-500 text-center">
          You&apos;ll be redirected to Notion to authorize access to this page.
        </p>
      )}
    </form>
  );
}
