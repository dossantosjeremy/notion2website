import type { BlockObjectResponse } from "@/lib/types/notion";

interface Props {
  block: BlockObjectResponse;
}

export function UnsupportedBlock({ block }: Props) {
  if (process.env.NODE_ENV === "development") {
    return (
      <div className="my-2 rounded border border-dashed border-gray-300 px-3 py-2 text-xs text-gray-400">
        Unsupported block: {block.type}
      </div>
    );
  }
  return null;
}
