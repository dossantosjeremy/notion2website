import type { BlockObjectResponse } from "@/lib/types/notion";
import { RichText } from "./RichText";

interface Props {
  block: BlockObjectResponse & { type: "image" };
}

export function ImageBlock({ block }: Props) {
  const { image } = block;
  const url =
    image.type === "external" ? image.external.url : image.file?.url ?? "";
  const caption = image.caption ?? [];

  return (
    <figure className="my-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={caption.map((r) => r.plain_text).join("") || "Image"}
        className="rounded-lg w-full object-cover"
        loading="lazy"
      />
      {caption.length > 0 && (
        <figcaption className="mt-2 text-center text-xs text-gray-500">
          <RichText richText={caption} />
        </figcaption>
      )}
    </figure>
  );
}
