"use client";

import type { BlockObjectResponse } from "@/lib/types/notion";
import { RichText } from "./RichText";
import { useState } from "react";
import { BlockRenderer } from "./BlockRenderer";

interface Props {
  block: BlockObjectResponse & {
    type: "toggle";
    children?: BlockObjectResponse[];
  };
}

export function ToggleBlock({ block }: Props) {
  const [open, setOpen] = useState(false);
  const children = (block as { children?: BlockObjectResponse[] }).children ?? [];

  return (
    <div className="my-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-start gap-2 w-full text-left hover:bg-gray-50 rounded px-1 py-0.5 transition-colors"
      >
        <span
          className={`mt-0.5 text-gray-400 text-sm transition-transform ${open ? "rotate-90" : ""}`}
        >
          ▶
        </span>
        <span>
          <RichText richText={block.toggle.rich_text} />
        </span>
      </button>
      {open && children.length > 0 && (
        <div className="ml-6 mt-1">
          <BlockRenderer blocks={children} />
        </div>
      )}
    </div>
  );
}
