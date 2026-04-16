/**
 * Extracts the Notion page ID (32 hex chars, no dashes) from a Notion URL.
 * Handles formats like:
 *   https://www.notion.so/My-Page-abc123def456abc123def456abc123de
 *   https://notion.so/workspace/abc123def456abc123def456abc123de
 *   https://www.notion.so/abc123def456abc123def456abc123de?pvs=4
 *   abc123de-f456-abc1-23de-f456abc123de  (UUID with dashes)
 */
export function extractPageId(input: string): string | null {
  const trimmed = input.trim();

  // Match 32-char hex (no dashes)
  const hexMatch = trimmed.match(/([a-f0-9]{32})(?:[^a-f0-9]|$)/i);
  if (hexMatch) return hexMatch[1].toLowerCase();

  // Match UUID with dashes: 8-4-4-4-12
  const uuidMatch = trimmed.match(
    /([a-f0-9]{8})-([a-f0-9]{4})-([a-f0-9]{4})-([a-f0-9]{4})-([a-f0-9]{12})/i
  );
  if (uuidMatch) {
    return (uuidMatch[1] + uuidMatch[2] + uuidMatch[3] + uuidMatch[4] + uuidMatch[5]).toLowerCase();
  }

  return null;
}

/** Format a 32-char hex page ID as a UUID (with dashes) for the Notion API */
export function toUUID(pageId: string): string {
  const h = pageId.replace(/-/g, "");
  if (h.length !== 32) return pageId;
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
