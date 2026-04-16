import type { BlockObjectResponse } from "@/lib/types/notion";
import { RichText } from "./RichText";

interface Props {
  block: BlockObjectResponse & { type: "quote" };
}

export function QuoteBlock({ block }: Props) {
  return (
    <blockquote className="border-l-4 border-gray-300 pl-4 my-4 text-gray-600 italic">
      <RichText richText={block.quote.rich_text} />
    </blockquote>
  );
}
