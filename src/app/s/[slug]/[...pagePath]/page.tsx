import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { renderSitePage } from "@/lib/utils/render-page";
import type { Metadata } from "next";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string; pagePath: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, pagePath } = await params;
  const pageSlug = pagePath[pagePath.length - 1];
  const site = await prisma.site.findUnique({ where: { slug } });
  if (!site) return {};
  const page = await prisma.page.findFirst({
    where: { siteId: site.id, slug: pageSlug },
  });
  return {
    title: page ? `${page.title} — ${site.title}` : site.title,
  };
}

export default async function PublishedSiteSubPage({ params }: Props) {
  const { slug, pagePath } = await params;
  // Use the last path segment as the page slug
  const pageSlugStr = pagePath[pagePath.length - 1];

  const site = await prisma.site.findUnique({
    where: { slug, published: true },
    include: { pages: { orderBy: [{ depth: "asc" }, { order: "asc" }] } },
  });

  if (!site) notFound();

  const page = site.pages.find((p) => p.slug === pageSlugStr);
  if (!page) notFound();

  const siteWithPages = {
    id: site.id,
    title: site.title,
    slug: site.slug,
    theme: site.theme,
    themeSuggested: site.themeSuggested,
    published: site.published,
    rootNotionPageId: site.rootNotionPageId,
    pages: site.pages,
  };

  return renderSitePage(siteWithPages, page, false);
}
