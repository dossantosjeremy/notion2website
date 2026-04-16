import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import type { OAuthConfig } from "next-auth/providers/index";
import { prisma } from "@/lib/prisma";

interface NotionProfile {
  object: string;
  id: string;
  type: string;
  bot: {
    owner: {
      type: string;
      user: {
        id: string;
        name: string;
        avatar_url: string | null;
        type: string;
        person?: { email: string };
      };
    };
    workspace_name: string | null;
    workspace_icon: string | null;
    workspace_id: string;
  };
}

const NotionProvider: OAuthConfig<NotionProfile> = {
  id: "notion",
  name: "Notion",
  type: "oauth",
  authorization: {
    url: "https://api.notion.com/v1/oauth/authorize",
    params: {
      owner: "user",
      response_type: "code",
    },
  },
  token: {
    url: "https://api.notion.com/v1/oauth/token",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async request({ params, provider }: any) {
      const credentials = Buffer.from(
        `${provider.clientId}:${provider.clientSecret}`
      ).toString("base64");

      const response = await fetch("https://api.notion.com/v1/oauth/token", {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: params.code,
          grant_type: "authorization_code",
          redirect_uri: provider.callbackUrl,
        }),
      });

      const tokens = await response.json();
      return { tokens };
    },
  },
  userinfo: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async request({ tokens }: any) {
      const response = await fetch("https://api.notion.com/v1/users/me", {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          "Notion-Version": "2022-06-28",
        },
      });
      return response.json();
    },
  },
  profile(profile: NotionProfile) {
    const user = profile.bot.owner.user;
    return {
      id: user.id,
      name: user.name,
      email: user.person?.email ?? null,
      image: user.avatar_url,
      notionWorkspaceId: profile.bot.workspace_id,
      notionWorkspaceName: profile.bot.workspace_name,
    };
  },
  clientId: process.env.NOTION_CLIENT_ID!,
  clientSecret: process.env.NOTION_CLIENT_SECRET!,
  checks: ["state"],
};

export const authOptions: NextAuthOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma) as any,
  providers: [NotionProvider],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
  pages: {
    error: "/auth/error",
  },
  session: { strategy: "database" },
};
