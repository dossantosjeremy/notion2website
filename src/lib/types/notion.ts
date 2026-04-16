import type { BlockObjectResponse, RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

export type { BlockObjectResponse, RichTextItemResponse };

export type Theme = "minimal" | "docs" | "showcase";

export interface PageNode {
  notionPageId: string;
  parentPageId: string | null;
  title: string;
  slug: string;
  order: number;
  depth: number;
  blocks: BlockObjectResponse[];
  coverImageUrl: string | null;
  iconEmoji: string | null;
  iconImageUrl: string | null;
}

export interface SiteWithPages {
  id: string;
  title: string;
  slug: string;
  theme: string;
  themeSuggested: string | null;
  published: boolean;
  rootNotionPageId: string;
  pages: PageRecord[];
}

export interface PageRecord {
  id: string;
  siteId: string;
  notionPageId: string;
  parentPageId: string | null;
  title: string;
  slug: string;
  order: number;
  depth: number;
  blocksJson: string | null;
  coverImageUrl: string | null;
  iconEmoji: string | null;
  iconImageUrl: string | null;
}
