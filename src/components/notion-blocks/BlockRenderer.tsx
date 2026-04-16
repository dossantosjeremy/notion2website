import type { BlockObjectResponse } from "@/lib/types/notion";
import { ParagraphBlock } from "./ParagraphBlock";
import { HeadingBlock } from "./HeadingBlock";
import { CalloutBlock } from "./CalloutBlock";
import { QuoteBlock } from "./QuoteBlock";
import { CodeBlock } from "./CodeBlock";
import { ImageBlock } from "./ImageBlock";
import { VideoBlock } from "./VideoBlock";
import { DividerBlock } from "./DividerBlock";
import { BookmarkBlock } from "./BookmarkBlock";
import { TodoBlock } from "./TodoBlock";
import { ToggleBlock } from "./ToggleBlock";
import { TableBlock } from "./TableBlock";
import { UnsupportedBlock } from "./UnsupportedBlock";
import { RichText } from "./RichText";

type ListType = "bulleted" | "numbered";

interface ListGroup {
  kind: "list";
  listType: ListType;
  items: (BlockObjectResponse & {
    type: "bulleted_list_item" | "numbered_list_item";
    children?: BlockObjectResponse[];
  })[];
}

type RenderItem = BlockObjectResponse | ListGroup;

/** Pre-process flat block array: consecutive list items are grouped */
function groupBlocks(blocks: BlockObjectResponse[]): RenderItem[] {
  const result: RenderItem[] = [];

  for (const block of blocks) {
    if (block.type === "bulleted_list_item" || block.type === "numbered_list_item") {
      const listType: ListType =
        block.type === "bulleted_list_item" ? "bulleted" : "numbered";
      const last = result[result.length - 1];
      if (last && "kind" in last && last.kind === "list" && last.listType === listType) {
        last.items.push(
          block as BlockObjectResponse & {
            type: "bulleted_list_item" | "numbered_list_item";
            children?: BlockObjectResponse[];
          }
        );
      } else {
        result.push({
          kind: "list",
          listType,
          items: [
            block as BlockObjectResponse & {
              type: "bulleted_list_item" | "numbered_list_item";
              children?: BlockObjectResponse[];
            },
          ],
        });
      }
    } else {
      result.push(block);
    }
  }

  return result;
}

interface BlockRendererProps {
  blocks: BlockObjectResponse[];
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  const items = groupBlocks(blocks);

  return (
    <div className="notion-content">
      {items.map((item, i) => {
        if ("kind" in item && item.kind === "list") {
          if (item.listType === "bulleted") {
            return (
              <ul key={i} className="my-3 space-y-1 list-disc pl-6">
                {item.items.map((block) => {
                  const b = block as BlockObjectResponse & { type: "bulleted_list_item"; children?: BlockObjectResponse[] };
                  return (
                    <li key={b.id} className="leading-relaxed">
                      <RichText richText={(b as unknown as { bulleted_list_item: { rich_text: import("@/lib/types/notion").RichTextItemResponse[] } }).bulleted_list_item.rich_text} />
                      {(b.children ?? []).length > 0 && <BlockRenderer blocks={b.children!} />}
                    </li>
                  );
                })}
              </ul>
            );
          } else {
            return (
              <ol key={i} className="my-3 space-y-1 list-decimal pl-6">
                {item.items.map((block) => {
                  const b = block as BlockObjectResponse & { type: "numbered_list_item"; children?: BlockObjectResponse[] };
                  return (
                    <li key={b.id} className="leading-relaxed">
                      <RichText richText={(b as unknown as { numbered_list_item: { rich_text: import("@/lib/types/notion").RichTextItemResponse[] } }).numbered_list_item.rich_text} />
                      {(b.children ?? []).length > 0 && <BlockRenderer blocks={b.children!} />}
                    </li>
                  );
                })}
              </ol>
            );
          }
        }

        const block = item as BlockObjectResponse;
        switch (block.type) {
          case "paragraph":
            return <ParagraphBlock key={block.id} block={block} />;
          case "heading_1":
            return <HeadingBlock key={block.id} block={block} level={1} />;
          case "heading_2":
            return <HeadingBlock key={block.id} block={block} level={2} />;
          case "heading_3":
            return <HeadingBlock key={block.id} block={block} level={3} />;
          case "to_do":
            return <TodoBlock key={block.id} block={block} />;
          case "toggle":
            return (
              <ToggleBlock
                key={block.id}
                block={
                  block as BlockObjectResponse & {
                    type: "toggle";
                    children?: BlockObjectResponse[];
                  }
                }
              />
            );
          case "quote":
            return <QuoteBlock key={block.id} block={block} />;
          case "callout":
            return <CalloutBlock key={block.id} block={block} />;
          case "code":
            return <CodeBlock key={block.id} block={block} />;
          case "divider":
            return <DividerBlock key={block.id} />;
          case "image":
            return <ImageBlock key={block.id} block={block} />;
          case "video":
            return <VideoBlock key={block.id} block={block} />;
          case "bookmark":
            return <BookmarkBlock key={block.id} block={block} />;
          case "table":
            return (
              <TableBlock
                key={block.id}
                block={
                  block as BlockObjectResponse & {
                    type: "table";
                    children?: BlockObjectResponse[];
                  }
                }
              />
            );
          // Skip navigation-only blocks
          case "child_page":
          case "child_database":
          case "table_of_contents":
          case "breadcrumb":
          case "column_list":
          case "column":
            return null;
          default:
            return <UnsupportedBlock key={block.id} block={block} />;
        }
      })}
    </div>
  );
}
