import type { BlockObjectResponse } from "@/lib/types/notion";
import { RichText } from "./RichText";

interface Props {
  block: BlockObjectResponse & { type: "to_do" };
}

export function TodoBlock({ block }: Props) {
  const { rich_text, checked } = block.to_do;
  return (
    <div className="flex items-start gap-2 my-1">
      <span className="mt-0.5 text-base">{checked ? "☑" : "☐"}</span>
      <span className={checked ? "line-through text-gray-400" : ""}>
        <RichText richText={rich_text} />
      </span>
    </div>
  );
}
