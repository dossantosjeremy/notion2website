import { Client } from "@notionhq/client";

export function notionClient(accessToken: string): Client {
  return new Client({ auth: accessToken });
}
