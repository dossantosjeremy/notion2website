import type { BlockObjectResponse } from "@/lib/types/notion";

interface Props {
  block: BlockObjectResponse & { type: "code" };
}

export function CodeBlock({ block }: Props) {
  const { rich_text, language } = block.code;
  const code = rich_text.map((r) => r.plain_text).join("");

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-gray-200">
      {language && language !== "plain text" && (
        <div className="bg-gray-100 px-4 py-1.5 text-xs text-gray-500 font-mono border-b border-gray-200">
          {language}
        </div>
      )}
      <pre className="bg-gray-950 text-gray-100 p-4 overflow-x-auto text-sm font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
