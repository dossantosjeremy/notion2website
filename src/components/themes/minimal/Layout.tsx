import Link from "next/link";
import type { PageRecord } from "@/lib/types/notion";

interface MinimalLayoutProps {
  site: { title: string; slug: string };
  pages: PageRecord[];
  children: React.ReactNode;
}

export function MinimalLayout({ site, pages, children }: MinimalLayoutProps) {
  const topLevelPages = pages.filter((p) => p.depth === 1).slice(0, 8);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href={`/s/${site.slug}`} className="font-semibold text-gray-900 hover:text-gray-700">
            {site.title}
          </Link>
          {topLevelPages.length > 0 && (
            <nav className="hidden sm:flex items-center gap-4">
              {topLevelPages.map((page) => (
                <Link
                  key={page.id}
                  href={`/s/${site.slug}/${page.slug}`}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {page.title}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">{children}</main>

      <footer className="border-t border-gray-100 px-6 py-6 text-center text-xs text-gray-400">
        Built with notion2website
      </footer>
    </div>
  );
}
