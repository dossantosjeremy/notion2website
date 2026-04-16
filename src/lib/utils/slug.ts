import slugify from "slugify";
import { prisma } from "@/lib/prisma";

export function toSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  }).slice(0, 60) || "untitled";
}

export async function uniqueSiteSlug(base: string): Promise<string> {
  const slug = toSlug(base);
  const existing = await prisma.site.findUnique({ where: { slug } });
  if (!existing) return slug;
  // Append random 4-char suffix
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${slug}-${suffix}`;
}

export function pageSlug(title: string, existingSlugs: Set<string>): string {
  const slug = toSlug(title);
  if (!existingSlugs.has(slug)) return slug;
  let i = 2;
  while (existingSlugs.has(`${slug}-${i}`)) i++;
  return `${slug}-${i}`;
}
