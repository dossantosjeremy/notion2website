import Link from "next/link";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "Access was denied. Make sure you authorized access to your Notion workspace.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An authentication error occurred.",
};

export default async function AuthErrorPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const message = ERROR_MESSAGES[error ?? ""] || ERROR_MESSAGES.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-10 max-w-md w-full text-center flex flex-col gap-4">
        <div className="text-4xl">⚠️</div>
        <h1 className="text-xl font-bold text-gray-900">Authentication error</h1>
        <p className="text-sm text-gray-500">{message}</p>
        {error && (
          <p className="text-xs text-gray-400">Error code: {error}</p>
        )}
        <Link
          href="/"
          className="mt-2 inline-block rounded-lg bg-gray-900 text-white px-6 py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
