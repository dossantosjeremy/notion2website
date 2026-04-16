import type { BlockObjectResponse } from "@/lib/types/notion";
import { RichText } from "./RichText";
import { toSlug } from "@/lib/utils/slug";

type HeadingBlock = BlockObjectResponse & {
  type: "heading_1" | "heading_2" | "heading_3";
};

interface Props {
  block: HeadingBlock;
  level: 1 | 2 | 3;
}

export function HeadingBlock({ block, level }: Props) {
  const richText =
    level === 1
      ? (block as BlockObjectResponse & { type: "heading_1" }).heading_1.rich_text
      : level === 2
        ? (block as BlockObjectResponse & { type: "heading_2" }).heading_2.rich_text
        : (block as BlockObjectResponse & { type: "heading_3" }).heading_3.rich_text;

  const text = richText.map((r) => r.plain_text).join("");
  const id = toSlug(text);

  const Tag = `h${level}` as "h1" | "h2" | "h3";
  const classes = {
    1: "text-2xl font-bold text-gray-900 mt-8 mb-3",
    2: "text-xl font-semibold text-gray-900 mt-6 mb-2",
    3: "text-lg font-semibold text-gray-800 mt-4 mb-1",
  };

  return (
    <Tag id={id} className={classes[level]}>
      <RichText richText={richText} />
    </Tag>
  );
}
