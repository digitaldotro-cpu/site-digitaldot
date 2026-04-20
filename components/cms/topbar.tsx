"use client";

import { Sparkles, ChevronDown, Undo2, Redo2, Eye } from "lucide-react";
import type { CmsPage } from "@/types/cms";
import { cn } from "@/lib/utils";

type TopbarProps = {
  pages: CmsPage[];
  selectedPageId: string;
  onSelectPage: (pageId: string) => void;
  onPreview: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
  autosaveLabel: string;
};

const tabs = ["Editor", "SEO", "Analytics"];

export function Topbar({
  pages,
  selectedPageId,
  onSelectPage,
  onPreview,
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isSaving,
  autosaveLabel,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#2c3a43]/20 bg-slate-950/60 px-4 backdrop-blur-2xl sm:px-6">
      <div className="flex items-center gap-4 sm:gap-8">
        <div className="relative">
          <Sparkles className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#66fcf1]" />
          <select
            value={selectedPageId}
            onChange={(event) => onSelectPage(event.target.value)}
            className="h-9 appearance-none rounded-full border border-[#314048]/30 bg-[#1e2020] px-10 pr-8 text-sm font-medium text-white focus:border-[#66fcf1] focus:outline-none"
          >
            {pages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        </div>

        <div className="hidden items-center gap-5 md:flex">
          {tabs.map((tab) => {
            const active = tab === "Editor";

            return (
              <button
                key={tab}
                type="button"
                className={cn(
                  "relative pb-1 text-sm font-medium transition",
                  active ? "text-[#66fcf1]" : "text-slate-400 hover:text-cyan-300",
                )}
              >
                {tab}
                {active ? <span className="absolute inset-x-0 -bottom-[9px] h-0.5 rounded-full bg-[#66fcf1]" /> : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#314048]/30 bg-[#14181b] text-[#99aab3] transition hover:border-[#66fcf1]/60 hover:text-[#66fcf1] disabled:cursor-not-allowed disabled:opacity-45"
          aria-label="Undo"
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#314048]/30 bg-[#14181b] text-[#99aab3] transition hover:border-[#66fcf1]/60 hover:text-[#66fcf1] disabled:cursor-not-allowed disabled:opacity-45"
          aria-label="Redo"
        >
          <Redo2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onPreview}
          className="hidden h-9 items-center gap-2 rounded-full px-4 text-sm font-medium text-slate-300 transition hover:text-white sm:inline-flex"
        >
          <Eye className="h-4 w-4" />
          Preview
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex h-9 min-w-[104px] items-center justify-center rounded-full bg-[#62f9ee] px-5 text-sm font-bold text-[#003734] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Publish"}
        </button>

        <div className="hidden h-9 items-center rounded-full border border-[#314048]/30 bg-[#1e2020] px-3 text-xs font-medium text-slate-400 lg:flex">
          {autosaveLabel}
        </div>
      </div>
    </header>
  );
}
