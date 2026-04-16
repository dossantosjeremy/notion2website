import type { PageRecord, SiteWithPages } from "@/lib/types/notion";
import { BlockRenderer } from "@/components/notion-blocks/BlockRenderer";
import { MinimalLayout } from "@/components/themes/minimal/Layout";
import { DocsLayout } from "@/components/themes/docs/Layout";
import { ShowcaseLayout } from "@/components/themes/showcase/Layout";
import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export function renderSitePage(
  site: SiteWithPages,
  currentPage: PageRecord,
  isRoot: boolean
) {
  const blocks: BlockObjectResponse[] = currentPage.blocksJson
    ? (JSON.parse(currentPage.blocksJson) as BlockObjectResponse[])
    : [];

  const content = <BlockRenderer blocks={blocks} />;
  const siteInfo = { title: site.title, slug: site.slug };

  switch (site.theme) {
    case "docs":
      return (
        <DocsLayout
          site={siteInfo}
          pages={site.pages}
          currentPageId={currentPage.notionPageId}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {currentPage.iconEmoji && (
              <span className="mr-3">{currentPage.iconEmoji}</span>
            )}
            {currentPage.title}
          </h1>
          {content}
        </DocsLayout>
      );

    case "showcase":
      return (
        <ShowcaseLayout
          site={siteInfo}
          pages={site.pages}
          isRoot={isRoot}
          currentPage={currentPage}
        >
          {content}
        </ShowcaseLayout>
      );

    default: // minimal
      return (
        <MinimalLayout site={siteInfo} pages={site.pages}>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {currentPage.iconEmoji && (
              <span className="mr-3">{currentPage.iconEmoji}</span>
            )}
            {currentPage.title}
          </h1>
          {content}
        </MinimalLayout>
      );
  }
}
