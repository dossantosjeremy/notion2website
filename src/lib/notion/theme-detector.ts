import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { PageNode, Theme } from "@/lib/types/notion";

function countBlockTypes(
  blocks: BlockObjectResponse[],
  types: string[]
): number {
  return blocks.filter((b) => types.includes(b.type)).length;
}

function hasBlockType(blocks: BlockObjectResponse[], type: string): boolean {
  return blocks.some((b) => b.type === type);
}

export function suggestTheme(pages: PageNode[]): Theme {
  if (pages.length === 0) return "minimal";

  const rootBlocks = pages[0].blocks;
  const pageCount = pages.length;

  const headingCount = countBlockTypes(rootBlocks, [
    "heading_1",
    "heading_2",
    "heading_3",
  ]);
  const hasImage = hasBlockType(rootBlocks, "image");
  const hasTable = hasBlockType(rootBlocks, "table");
  const hasToggle = hasBlockType(rootBlocks, "toggle");

  // Docs: many child pages + heading-heavy, possibly has toggles/tables (reference style)
  if (pageCount >= 4 && headingCount >= 3) return "docs";
  if (pageCount >= 3 && (hasToggle || hasTable)) return "docs";

  // Showcase: visual content or portfolio-style
  if (hasImage || (pageCount >= 3 && headingCount <= 2)) return "showcase";

  // Minimal: default — prose, few child pages
  return "minimal";
}
