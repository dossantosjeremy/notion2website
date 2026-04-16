import type { BlockObjectResponse } from "@/lib/types/notion";
import { RichText } from "./RichText";

interface Props {
  block: BlockObjectResponse & { type: "bookmark" };
}

export function BookmarkBlock({ block }: Props) {
  const { url, caption } = block.bookmark;
  let displayUrl = url;
  try {
    displayUrl = new URL(url).hostname;
  } catch {
    // keep as-is
  }

  return (
    <div className="my-4">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors no-underline group"
      >
        <div className="min-w-0 flex-1">
          {caption && caption.length > 0 ? (
            <p className="text-sm font-medium text-gray-900 truncate">
              <RichText richText={caption} />
            </p>
          ) : (
            <p className="text-sm font-medium text-gray-900 truncate">{displayUrl}</p>
          )}
          <p className="text-xs text-gray-400 truncate">{url}</p>
        </div>
        <svg
          className="shrink-0 h-4 w-4 text-gray-400 group-hover:text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    </div>
  );
}
