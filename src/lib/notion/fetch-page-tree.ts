import type { Client } from "@notionhq/client";
import type {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { PageNode } from "@/lib/types/notion";
import { pageSlug } from "@/lib/utils/slug";

const RATE_LIMIT_DELAY_MS = 350; // ~3 req/s

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getTitle(page: PageObjectResponse): string {
  const titleProp = Object.values(page.properties).find(
    (p) => p.type === "title"
  );
  if (titleProp && titleProp.type === "title") {
    return titleProp.title.map((t) => t.plain_text).join("") || "Untitled";
  }
  return "Untitled";
}

function getCoverUrl(page: PageObjectResponse): string | null {
  if (!page.cover) return null;
  if (page.cover.type === "external") return page.cover.external.url;
  if (page.cover.type === "file") return page.cover.file.url;
  return null;
}

function getIconEmoji(page: PageObjectResponse): string | null {
  if (!page.icon) return null;
  if (page.icon.type === "emoji") return page.icon.emoji;
  return null;
}

function getIconImageUrl(page: PageObjectResponse): string | null {
  if (!page.icon) return null;
  if (page.icon.type === "file") return page.icon.file.url;
  if (page.icon.type === "external") return page.icon.external.url;
  return null;
}

async function fetchAllBlocks(
  notion: Client,
  blockId: string
): Promise<BlockObjectResponse[]> {
  const blocks: BlockObjectResponse[] = [];
  let cursor: string | undefined = undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
    });

    for (const block of response.results) {
      if ("type" in block) {
        const typedBlock = block as BlockObjectResponse;
        // Recursively fetch children for blocks that have them
        if (
          typedBlock.has_children &&
          typedBlock.type !== "child_page" &&
          typedBlock.type !== "child_database"
        ) {
          await delay(RATE_LIMIT_DELAY_MS);
          const children = await fetchAllBlocks(notion, typedBlock.id);
          // Attach children directly on the block for rendering
          (typedBlock as BlockObjectResponse & { children?: BlockObjectResponse[] }).children =
            children;
        }
        blocks.push(typedBlock);
      }
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return blocks;
}

export async function fetchPageTree(
  notion: Client,
  rootPageId: string,
  maxDepth = 3
): Promise<PageNode[]> {
  const allPages: PageNode[] = [];
  const slugSet = new Set<string>();

  async function crawlPage(
    pageId: string,
    parentPageId: string | null,
    depth: number,
    order: number
  ) {
    if (depth > maxDepth) return;

    await delay(depth > 0 ? RATE_LIMIT_DELAY_MS : 0);

    // Fetch page metadata
    const pageObj = (await notion.pages.retrieve({
      page_id: pageId,
    })) as PageObjectResponse;

    const title = getTitle(pageObj);
    const slug =
      depth === 0 ? "index" : pageSlug(title, slugSet);
    slugSet.add(slug);

    // Fetch all blocks
    await delay(RATE_LIMIT_DELAY_MS);
    const blocks = await fetchAllBlocks(notion, pageId);

    const node: PageNode = {
      notionPageId: pageId,
      parentPageId,
      title,
      slug,
      order,
      depth,
      blocks,
      coverImageUrl: getCoverUrl(pageObj),
      iconEmoji: getIconEmoji(pageObj),
      iconImageUrl: getIconImageUrl(pageObj),
    };

    allPages.push(node);

    // Find child pages in blocks and recurse
    const childPageBlocks = blocks.filter(
      (b) => b.type === "child_page"
    );
    for (let i = 0; i < childPageBlocks.length; i++) {
      await crawlPage(childPageBlocks[i].id, pageId, depth + 1, i);
    }
  }

  await crawlPage(rootPageId, null, 0, 0);
  return allPages;
}
