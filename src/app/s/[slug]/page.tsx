import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { renderSitePage } from "@/lib/utils/render-page";
import type { Metadata } from "next";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const site = await prisma.site.findUnique({ where: { slug } });
  if (!site) return {};
  return {
    title: site.title,
    description: `${site.title} — powered by notion2website`,
  };
}

export default async function PublishedSiteRootPage({ params }: Props) {
  const { slug } = await params;

  const site = await prisma.site.findUnique({
    where: { slug, published: true },
    include: { pages: { orderBy: [{ depth: "asc" }, { order: "asc" }] } },
  });

  if (!site) notFound();

  const rootPage = site.pages.find((p) => p.depth === 0);
  if (!rootPage) notFound();

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

  return renderSitePage(siteWithPages, rootPage, true);
}
