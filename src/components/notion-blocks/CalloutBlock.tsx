import type { BlockObjectResponse } from "@/lib/types/notion";
import { RichText } from "./RichText";

interface Props {
  block: BlockObjectResponse & { type: "callout" };
}

export function CalloutBlock({ block }: Props) {
  const { rich_text, icon } = block.callout;
  const emoji = icon?.type === "emoji" ? icon.emoji : "💡";

  return (
    <div className="flex gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 my-4">
      <span className="text-lg shrink-0">{emoji}</span>
      <div className="text-sm text-gray-700 leading-relaxed">
        <RichText richText={rich_text} />
      </div>
    </div>
  );
}
