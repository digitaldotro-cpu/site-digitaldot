"use client";

import type { DragEvent } from "react";
import { Eye, EyeOff, GripVertical, Plus, Trash2 } from "lucide-react";
import type { PageSection } from "@/types/cms";
import { cn } from "@/lib/utils";
import { PanelTitle } from "@/components/cms/ui/form-controls";

type StructurePanelProps = {
  sections: PageSection[];
  selectedSectionId?: string;
  onSelect: (sectionId: string) => void;
  onReorder: (sourceIndex: number, targetIndex: number) => void;
  onToggleVisibility: (sectionId: string) => void;
  onAdd: () => void;
  onDelete: (sectionId: string) => void;
};

export function StructurePanel({
  sections,
  selectedSectionId,
  onSelect,
  onReorder,
  onToggleVisibility,
  onAdd,
  onDelete,
}: StructurePanelProps) {
  return (
    <section className="w-full border-b border-[#3c4948]/20 bg-[#1a1c1c] p-6 lg:h-full lg:w-72 lg:border-b-0 lg:border-r">
      <PanelTitle>Page Structure</PanelTitle>

      <div className="mt-6 space-y-3">
        {sections.map((section, index) => {
          const active = section.id === selectedSectionId;
          const isVisible = section.settings.visible;

          return (
            <button
              key={section.id}
              type="button"
              draggable
              onClick={() => onSelect(section.id)}
              onDragStart={(event: DragEvent<HTMLButtonElement>) =>
                event.dataTransfer.setData("text/plain", String(index))
              }
              onDragOver={(event: DragEvent<HTMLButtonElement>) => event.preventDefault()}
              onDrop={(event: DragEvent<HTMLButtonElement>) => {
                event.preventDefault();
                const sourceIndex = Number(event.dataTransfer.getData("text/plain"));
                if (!Number.isNaN(sourceIndex)) {
                  onReorder(sourceIndex, index);
                }
              }}
              className={cn(
                "group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition",
                active
                  ? "border-[#66fcf1]/30 bg-[#333535] text-white shadow-lg"
                  : "border-[#3c4948]/20 bg-[#1e2020] text-[#bacac7] hover:bg-[#333535]",
              )}
            >
              <GripVertical className="h-4 w-4 text-[#859491]" />
              <span className="flex-1 text-sm font-medium">{section.name}</span>
              <span
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onToggleVisibility(section.id);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onToggleVisibility(section.id);
                  }
                }}
                className={cn(
                  "inline-flex h-7 w-7 items-center justify-center rounded-full border transition",
                  isVisible
                    ? "border-[#00504b] text-[#62f9ee] hover:border-[#62f9ee]"
                    : "border-[#3c4948] text-[#859491] hover:text-[#e3e2e2]",
                )}
                aria-label={isVisible ? `Ascunde ${section.name}` : `Afișează ${section.name}`}
              >
                {isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              </span>
              {active ? <span className="h-1.5 w-1.5 rounded-full bg-[#66fcf1]" /> : null}
              <span
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onDelete(section.id);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onDelete(section.id);
                  }
                }}
                className="invisible inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#4a2d35] text-[#e8a8b1] transition hover:border-[#dd5f76] hover:text-[#ffd0d6] group-hover:visible"
                aria-label={`Șterge ${section.name}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#3c4948]/50 text-sm font-medium text-[#bacac7] transition hover:border-[#62f9ee]/60 hover:text-white"
      >
        <Plus className="h-4 w-4" />
        Add Section
      </button>
    </section>
  );
}
