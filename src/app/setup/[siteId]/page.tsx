import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SetupClient } from "./SetupClient";

interface Props {
  params: Promise<{ siteId: string }>;
}

export default async function SetupPage({ params }: Props) {
  const { siteId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/");
  }

  const site = await prisma.site.findFirst({
    where: { id: siteId, userId: session.user.id },
    include: { pages: { orderBy: [{ depth: "asc" }, { order: "asc" }] } },
  });

  if (!site) {
    notFound();
  }

  return <SetupClient site={site} />;
}
