"use client";

import { cn } from "@/lib/utils/cn";
import type { Theme } from "@/lib/types/notion";

interface ThemeOption {
  id: Theme;
  name: string;
  description: string;
  preview: string; // CSS class for preview
}

const THEMES: ThemeOption[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean prose layout for blogs, notes, and personal sites.",
    preview: "bg-white",
  },
  {
    id: "docs",
    name: "Documentation",
    description: "Sidebar navigation for knowledge bases and reference docs.",
    preview: "bg-slate-50",
  },
  {
    id: "showcase",
    name: "Showcase",
    description: "Visual hero and card grid for portfolios and landing pages.",
    preview: "bg-indigo-50",
  },
];

interface ThemePickerProps {
  selected: Theme;
  suggested: Theme | null;
  onSelect: (theme: Theme) => void;
}

export function ThemePicker({ selected, suggested, onSelect }: ThemePickerProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold text-gray-900">Choose a theme</h2>
        {suggested && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {suggested} suggested
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => onSelect(theme.id)}
            className={cn(
              "flex flex-col gap-2 rounded-xl border-2 p-4 text-left transition-all hover:border-gray-400",
              selected === theme.id
                ? "border-gray-900 shadow-sm"
                : "border-gray-200"
            )}
          >
            {/* Mini preview */}
            <div
              className={cn(
                "h-16 w-full rounded-lg border border-gray-100",
                theme.preview
              )}
            >
              <ThemePreviewIllustration themeId={theme.id} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-gray-900">
                  {theme.name}
                </span>
                {suggested === theme.id && (
                  <span className="text-xs text-indigo-600 font-medium">✦ Suggested</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{theme.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ThemePreviewIllustration({ themeId }: { themeId: Theme }) {
  if (themeId === "minimal") {
    return (
      <div className="p-2 flex flex-col gap-1">
        <div className="h-1.5 w-3/4 bg-gray-300 rounded" />
        <div className="h-1 w-full bg-gray-200 rounded" />
        <div className="h-1 w-5/6 bg-gray-200 rounded" />
        <div className="h-1 w-4/6 bg-gray-200 rounded" />
      </div>
    );
  }
  if (themeId === "docs") {
    return (
      <div className="p-2 flex gap-2 h-full">
        <div className="w-1/4 flex flex-col gap-1">
          <div className="h-1 bg-slate-300 rounded w-full" />
          <div className="h-1 bg-slate-200 rounded w-5/6" />
          <div className="h-1 bg-slate-200 rounded w-4/6" />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <div className="h-1.5 w-3/4 bg-slate-300 rounded" />
          <div className="h-1 w-full bg-slate-200 rounded" />
          <div className="h-1 w-5/6 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }
  return (
    <div className="p-2 flex flex-col gap-1.5">
      <div className="h-3 w-2/3 bg-indigo-300 rounded" />
      <div className="flex gap-1 mt-1">
        <div className="h-6 flex-1 bg-indigo-200 rounded" />
        <div className="h-6 flex-1 bg-indigo-200 rounded" />
        <div className="h-6 flex-1 bg-indigo-200 rounded" />
      </div>
    </div>
  );
}
