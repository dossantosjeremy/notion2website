import type { BlockObjectResponse } from "@/lib/types/notion";
import { RichText } from "./RichText";

interface Props {
  block: BlockObjectResponse & { type: "paragraph" };
}

export function ParagraphBlock({ block }: Props) {
  const { rich_text } = block.paragraph;
  if (!rich_text.length) return <br />;
  return (
    <p className="leading-relaxed">
      <RichText richText={rich_text} />
    </p>
  );
}
