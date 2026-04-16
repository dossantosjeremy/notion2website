import type { BlockObjectResponse } from "@/lib/types/notion";

interface Props {
  block: BlockObjectResponse & { type: "video" };
}

export function VideoBlock({ block }: Props) {
  const { video } = block;
  const url = video.type === "external" ? video.external.url : video.file?.url ?? "";

  // YouTube embed
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    return (
      <div className="my-6 aspect-video rounded-lg overflow-hidden border border-gray-200">
        <iframe
          src={`https://www.youtube.com/embed/${ytMatch[1]}`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          title="YouTube video"
        />
      </div>
    );
  }

  // Direct file
  return (
    <div className="my-6">
      <video src={url} controls className="w-full rounded-lg border border-gray-200" />
    </div>
  );
}
