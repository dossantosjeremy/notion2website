import type { PageRecord } from "@/lib/types/notion";

export interface PageTreeNode {
  page: PageRecord;
  children: PageTreeNode[];
}

export function buildPageTree(pages: PageRecord[]): PageTreeNode[] {
  const byId = new Map<string, PageTreeNode>();

  for (const page of pages) {
    byId.set(page.notionPageId, { page, children: [] });
  }

  const roots: PageTreeNode[] = [];

  for (const page of pages) {
    const node = byId.get(page.notionPageId)!;
    if (!page.parentPageId) {
      roots.push(node);
    } else {
      const parent = byId.get(page.parentPageId);
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    }
  }

  return roots;
}
