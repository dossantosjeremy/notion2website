import Link from "next/link";
import type { PageRecord } from "@/lib/types/notion";
import { buildPageTree } from "@/lib/utils/page-tree";

interface DocsLayoutProps {
  site: { title: string; slug: string };
  pages: PageRecord[];
  currentPageId: string;
  children: React.ReactNode;
}

export function DocsLayout({ site, pages, currentPageId, children }: DocsLayoutProps) {
  const tree = buildPageTree(pages);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <header className="border-b border-gray-200 px-6 py-3 flex items-center gap-4 sticky top-0 bg-white z-10">
        <Link href={`/s/${site.slug}`} className="font-semibold text-gray-900 text-sm hover:text-gray-700">
          {site.title}
        </Link>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-60 shrink-0 border-r border-gray-100 overflow-y-auto py-6 px-4 hidden md:block">
          <nav className="flex flex-col gap-0.5">
            {tree.map((node) => (
              <DocsSidebarItem
                key={node.page.id}
                node={node}
                siteSlug={site.slug}
                currentPageId={currentPageId}
              />
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-8 py-10 max-w-3xl">
          {children}
        </main>
      </div>
    </div>
  );
}

import type { PageTreeNode } from "@/lib/utils/page-tree";
import { cn } from "@/lib/utils/cn";

function DocsSidebarItem({
  node,
  siteSlug,
  currentPageId,
}: {
  node: PageTreeNode;
  siteSlug: string;
  currentPageId: string;
}) {
  const isRoot = node.page.depth === 0;
  const href = isRoot ? `/s/${siteSlug}` : `/s/${siteSlug}/${node.page.slug}`;
  const isActive = node.page.notionPageId === currentPageId;

  return (
    <div>
      <Link
        href={href}
        className={cn(
          "block px-2 py-1 rounded text-sm transition-colors",
          isActive
            ? "bg-gray-100 text-gray-900 font-medium"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
          node.page.depth > 0 && `pl-${Math.min(node.page.depth * 3 + 2, 8)}`
        )}
        style={{ paddingLeft: `${(node.page.depth) * 12 + 8}px` }}
      >
        {node.page.iconEmoji && (
          <span className="mr-1.5">{node.page.iconEmoji}</span>
        )}
        {node.page.title}
      </Link>
      {node.children.length > 0 && (
        <div>
          {node.children.map((child) => (
            <DocsSidebarItem
              key={child.page.id}
              node={child}
              siteSlug={siteSlug}
              currentPageId={currentPageId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
