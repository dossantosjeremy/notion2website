export const dynamic = "force-dynamic";

import { UrlInputForm } from "@/components/setup/UrlInputForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-gray-900">notion2website</span>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                My sites
              </Link>
              <Link
                href="/api/auth/signout"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign out
              </Link>
            </>
          ) : (
            <Link
              href="/api/auth/signin"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
              Turn your Notion page into a website
            </h1>
            <p className="text-lg text-gray-500 max-w-lg">
              Paste a Notion URL, connect your workspace, and get a fast, clean website
              with your chosen theme — published in minutes.
            </p>
          </div>

          <UrlInputForm />

          <div className="flex gap-8 text-sm text-gray-400 flex-wrap justify-center">
            <span>✦ 3 themes</span>
            <span>✦ Subpages supported</span>
            <span>✦ SEO-ready</span>
            <span>✦ Free subdomain</span>
          </div>
        </div>
      </div>

      {/* How it works */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-10">
            How it works
          </h2>
          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Paste your Notion URL",
                desc: "Share any Notion page — we'll detect the page and all its subpages automatically.",
              },
              {
                step: "2",
                title: "Pick a theme",
                desc: "We suggest a theme based on your content. Switch to Minimal, Docs, or Showcase with one click.",
              },
              {
                step: "3",
                title: "Publish",
                desc: "One click to go live on your own subdomain. Share it with the world.",
              },
            ].map(({ step, title, desc }) => (
              <li key={step} className="flex flex-col gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold">
                  {step}
                </div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="border-t border-gray-100 px-6 py-6 text-center text-xs text-gray-400">
        notion2website — not affiliated with Notion
      </footer>
    </main>
  );
}
