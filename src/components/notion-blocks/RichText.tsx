import type { RichTextItemResponse } from "@/lib/types/notion";

const COLOR_MAP: Record<string, string> = {
  gray: "text-gray-500",
  brown: "text-amber-800",
  orange: "text-orange-600",
  yellow: "text-yellow-600",
  green: "text-green-600",
  blue: "text-blue-600",
  purple: "text-purple-600",
  pink: "text-pink-600",
  red: "text-red-600",
  gray_background: "bg-gray-100",
  brown_background: "bg-amber-100",
  orange_background: "bg-orange-100",
  yellow_background: "bg-yellow-100",
  green_background: "bg-green-100",
  blue_background: "bg-blue-100",
  purple_background: "bg-purple-100",
  pink_background: "bg-pink-100",
  red_background: "bg-red-100",
};

interface RichTextProps {
  richText: RichTextItemResponse[];
  className?: string;
}

export function RichText({ richText, className }: RichTextProps) {
  return (
    <span className={className}>
      {richText.map((item, i) => {
        const { bold, italic, strikethrough, underline, code, color } = item.annotations;
        const href = item.type === "text" ? item.text?.link?.url : undefined;
        const text = item.plain_text;

        let el: React.ReactNode = text;

        if (code) {
          el = (
            <code
              key={i}
              className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[0.875em] text-gray-800"
            >
              {text}
            </code>
          );
        } else {
          const colorClass = color !== "default" ? (COLOR_MAP[color] ?? "") : "";
          const classes = [
            bold ? "font-semibold" : "",
            italic ? "italic" : "",
            strikethrough ? "line-through" : "",
            underline ? "underline" : "",
            colorClass,
          ]
            .filter(Boolean)
            .join(" ");

          el = classes ? (
            <span key={i} className={classes}>
              {text}
            </span>
          ) : (
            text
          );
        }

        if (href) {
          el = (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-gray-400 hover:decoration-gray-700 transition-colors"
            >
              {el}
            </a>
          );
        }

        return el;
      })}
    </span>
  );
}
