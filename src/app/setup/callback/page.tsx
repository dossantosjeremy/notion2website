export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notionClient } from "@/lib/notion/client";
import { fetchPageTree } from "@/lib/notion/fetch-page-tree";
import { suggestTheme } from "@/lib/notion/theme-detector";
import { extractPageId, toUUID } from "@/lib/notion/extract-page-id";
import { uniqueSiteSlug } from "@/lib/utils/slug";
import { Spinner } from "@/components/ui/Spinner";

interface SearchParams {
  searchParams: Promise<{ url?: string }>;
}

export default async function SetupCallbackPage({ searchParams }: SearchParams) {
  const { url } = await searchParams;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/");
  }

  if (!url) {
    redirect("/");
  }

  const rawPageId = extractPageId(url);
  if (!rawPageId) {
    redirect("/?error=invalid-url");
  }

  const pageId = toUUID(rawPageId);

  const account = await prisma.account.findFirst({
    where: { userId: session.user.id, provider: "notion" },
  });

  if (!account?.access_token) {
    redirect("/?error=no-notion-connection");
  }

  // Check if a site for this page already exists for this user
  const existingSite = await prisma.site.findFirst({
    where: { userId: session.user.id, rootNotionPageId: pageId },
  });
  if (existingSite) {
    redirect(`/setup/${existingSite.id}`);
  }

  const notion = notionClient(account.access_token);

  let siteId: string;
  try {
    const pages = await fetchPageTree(notion, pageId, 3);
    if (pages.length === 0) {
      redirect("/?error=no-pages");
    }

    const rootPage = pages[0];
    const suggestedTheme = suggestTheme(pages);
    const slug = await uniqueSiteSlug(rootPage.title);

    const site = await prisma.site.create({
      data: {
        userId: session.user.id,
        rootNotionPageId: pageId,
        rootNotionPageTitle: rootPage.title,
        title: rootPage.title,
        slug,
        theme: suggestedTheme,
        themeSuggested: suggestedTheme,
        lastSyncedAt: new Date(),
      },
    });

    siteId = site.id;

    for (const page of pages) {
      await prisma.page.upsert({
        where: {
          siteId_notionPageId: { siteId: site.id, notionPageId: page.notionPageId },
        },
        update: {
          title: page.title,
          slug: page.slug,
          parentPageId: page.parentPageId ? toUUID(page.parentPageId) : null,
          order: page.order,
          depth: page.depth,
          blocksJson: JSON.stringify(page.blocks),
          coverImageUrl: page.coverImageUrl,
          iconEmoji: page.iconEmoji,
          iconImageUrl: page.iconImageUrl,
        },
        create: {
          siteId: site.id,
          notionPageId: page.notionPageId,
          parentPageId: page.parentPageId ? toUUID(page.parentPageId) : null,
          title: page.title,
          slug: page.slug,
          order: page.order,
          depth: page.depth,
          blocksJson: JSON.stringify(page.blocks),
          coverImageUrl: page.coverImageUrl,
          iconEmoji: page.iconEmoji,
          iconImageUrl: page.iconImageUrl,
        },
      });
    }
  } catch (err) {
    console.error("Setup callback error:", err);
    redirect("/?error=fetch-failed");
  }

  redirect(`/setup/${siteId}`);

  // This renders briefly while server-side work is happening
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-gray-500">Fetching your Notion pages…</p>
      </div>
    </div>
  );
}
