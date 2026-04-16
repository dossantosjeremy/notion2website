import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ siteId: string }>;
}

export async function POST(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { siteId } = await params;

  const site = await prisma.site.findFirst({
    where: { id: siteId, userId: session.user.id },
  });

  if (!site) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Re-check slug uniqueness (guard against race conditions)
  const existing = await prisma.site.findFirst({
    where: { slug: site.slug, id: { not: siteId } },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Slug conflict — please choose a different URL slug" },
      { status: 409 }
    );
  }

  const updated = await prisma.site.update({
    where: { id: siteId },
    data: { published: true, publishedAt: new Date() },
  });

  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "localhost:3000";
  const isLocalhost = appDomain.startsWith("localhost");
  const url = isLocalhost
    ? `http://${appDomain}/s/${updated.slug}`
    : `https://${updated.slug}.${appDomain}`;

  return NextResponse.json({ site: updated, url });
}
