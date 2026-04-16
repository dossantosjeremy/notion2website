import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notionClient } from "@/lib/notion/client";
import { fetchPageTree } from "@/lib/notion/fetch-page-tree";
import { suggestTheme } from "@/lib/notion/theme-detector";
import { extractPageId, toUUID } from "@/lib/notion/extract-page-id";
import { uniqueSiteSlug } from "@/lib/utils/slug";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { notionPageUrl } = body as { notionPageUrl: string };

  if (!notionPageUrl) {
    return NextResponse.json({ error: "notionPageUrl is required" }, { status: 400 });
  }

  const rawPageId = extractPageId(notionPageUrl);
  if (!rawPageId) {
    return NextResponse.json(
      { error: "Could not extract a valid Notion page ID from the URL" },
      { status: 400 }
    );
  }

  const pageId = toUUID(rawPageId);

  // Get the user's Notion access token
  const account = await prisma.account.findFirst({
    where: { userId: session.user.id, provider: "notion" },
  });

  if (!account?.access_token) {
    return NextResponse.json(
      { error: "No Notion connection found. Please reconnect." },
      { status: 400 }
    );
  }

  const notion = notionClient(account.access_token);

  try {
    const pages = await fetchPageTree(notion, pageId, 3);

    if (pages.length === 0) {
      return NextResponse.json({ error: "No pages found" }, { status: 400 });
    }

    const rootPage = pages[0];
    const suggestedTheme = suggestTheme(pages);
    const siteTitle = rootPage.title;
    const slug = await uniqueSiteSlug(siteTitle);

    // Create the site
    const site = await prisma.site.create({
      data: {
        userId: session.user.id,
        rootNotionPageId: pageId,
        rootNotionPageTitle: rootPage.title,
        title: siteTitle,
        slug,
        theme: suggestedTheme,
        themeSuggested: suggestedTheme,
        lastSyncedAt: new Date(),
      },
    });

    // Upsert all pages
    for (const page of pages) {
      await prisma.page.upsert({
        where: {
          siteId_notionPageId: {
            siteId: site.id,
            notionPageId: page.notionPageId,
          },
        },
        update: {
          title: page.title,
          slug: page.slug,
          parentPageId: page.parentPageId
            ? toUUID(page.parentPageId)
            : null,
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
          parentPageId: page.parentPageId
            ? toUUID(page.parentPageId)
            : null,
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

    return NextResponse.json({
      siteId: site.id,
      suggestedTheme,
      pageCount: pages.length,
      title: siteTitle,
    });
  } catch (err: unknown) {
    console.error("Notion fetch error:", err);
    const message = err instanceof Error ? err.message : "Failed to fetch Notion pages";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
