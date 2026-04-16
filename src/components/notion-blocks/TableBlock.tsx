import type { BlockObjectResponse } from "@/lib/types/notion";
import { RichText } from "./RichText";

interface Props {
  block: BlockObjectResponse & {
    type: "table";
    children?: BlockObjectResponse[];
  };
}

export function TableBlock({ block }: Props) {
  const { has_column_header, has_row_header } = block.table;
  const rows = ((block as { children?: BlockObjectResponse[] }).children ?? []).filter(
    (b) => b.type === "table_row"
  ) as (BlockObjectResponse & { type: "table_row" })[];

  if (rows.length === 0) return null;

  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <tbody>
          {rows.map((row, ri) => {
            const cells = row.table_row.cells;
            const Tag = has_column_header && ri === 0 ? "th" : "td";
            return (
              <tr
                key={row.id}
                className={ri === 0 && has_column_header ? "bg-gray-50 font-semibold" : ""}
              >
                {cells.map((cell, ci) => (
                  <Tag
                    key={ci}
                    className={`border border-gray-200 px-3 py-2 text-left align-top ${
                      has_row_header && ci === 0 ? "font-semibold bg-gray-50" : ""
                    }`}
                  >
                    <RichText richText={cell} />
                  </Tag>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
