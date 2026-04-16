import Link from "next/link";
import type { PageRecord } from "@/lib/types/notion";

interface ShowcaseLayoutProps {
  site: { title: string; slug: string };
  pages: PageRecord[];
  isRoot: boolean;
  currentPage: PageRecord;
  children: React.ReactNode;
}

export function ShowcaseLayout({
  site,
  pages,
  isRoot,
  currentPage,
  children,
}: ShowcaseLayoutProps) {
  const childPages = pages.filter((p) => p.parentPageId === currentPage.notionPageId);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link href={`/s/${site.slug}`} className="font-semibold text-gray-900 hover:text-gray-700">
          {site.title}
        </Link>
        {!isRoot && (
          <Link href={`/s/${site.slug}`} className="text-sm text-gray-500 hover:text-gray-900">
            ← Home
          </Link>
        )}
      </nav>

      {/* Hero (only on root) */}
      {isRoot && (
        <div
          className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-24 text-center overflow-hidden"
          style={
            currentPage.coverImageUrl
              ? {
                  backgroundImage: `url(${currentPage.coverImageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {}
          }
        >
          {currentPage.coverImageUrl && (
            <div className="absolute inset-0 bg-white/70" />
          )}
          <div className="relative flex flex-col items-center gap-4">
            {currentPage.iconEmoji && (
              <span className="text-5xl">{currentPage.iconEmoji}</span>
            )}
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight max-w-2xl">
              {currentPage.title}
            </h1>
          </div>
        </div>
      )}

      {/* Non-root page title */}
      {!isRoot && (
        <div className="px-6 py-10 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {currentPage.iconEmoji && (
              <span className="mr-3">{currentPage.iconEmoji}</span>
            )}
            {currentPage.title}
          </h1>
        </div>
      )}

      {/* Content */}
      <div className={`max-w-3xl mx-auto px-6 ${isRoot ? "py-8" : "pb-16"}`}>
        {children}
      </div>

      {/* Child pages as cards (root only) */}
      {isRoot && childPages.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 pb-20">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {childPages.map((page) => (
              <Link
                key={page.id}
                href={`/s/${site.slug}/${page.slug}`}
                className="group rounded-xl border border-gray-200 p-5 hover:border-gray-400 hover:shadow-sm transition-all"
              >
                {page.iconEmoji && (
                  <div className="text-2xl mb-3">{page.iconEmoji}</div>
                )}
                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                  {page.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}

      <footer className="border-t border-gray-100 px-6 py-6 text-center text-xs text-gray-400">
        Built with notion2website
      </footer>
    </div>
  );
}
