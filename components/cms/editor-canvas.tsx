"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import type { MediaItem, PageSection, SectionElement } from "@/types/cms";
import { cn } from "@/lib/utils";

type EditorCanvasProps = {
  section?: PageSection;
  mediaById: Record<string, MediaItem>;
  selectedElementId?: string;
  onSelectElement: (elementId: string) => void;
  onInlineTextChange: (elementId: string, value: string) => void;
};

function styleFromElement(element: SectionElement): CSSProperties {
  return {
    color: element.style.color,
    fontSize: `${element.style.fontSize}px`,
    fontWeight: element.style.fontWeight,
    textAlign: element.style.textAlign,
    background: element.style.backgroundColor,
    padding: `${element.style.padding}px`,
    margin: `${element.style.margin}px`,
    borderRadius: `${element.style.borderRadius}px`,
    lineHeight: 1.1,
  };
}

function MediaPreview({ item, alt }: { item?: MediaItem; alt: string }) {
  if (!item) {
    return (
      <div className="flex h-44 items-center justify-center rounded-2xl border border-dashed border-[#335563] bg-[#111a1f] text-sm text-[#79909b]">
        Selectează media din panoul din dreapta.
      </div>
    );
  }

  if (item.type === "video") {
    return (
      <video
        controls
        preload="metadata"
        className="h-52 w-full rounded-2xl border border-[#233f4a] bg-[#091116] object-cover"
      >
        <source src={item.url} />
      </video>
    );
  }

  if (item.url.startsWith("data:")) {
    return (
      <Image
        src={item.url}
        alt={alt}
        width={960}
        height={540}
        unoptimized
        className="h-52 w-full rounded-2xl border border-[#233f4a] object-cover"
      />
    );
  }

  return (
    <div className="relative h-52 w-full overflow-hidden rounded-2xl border border-[#233f4a]">
      <Image src={item.url} alt={alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
    </div>
  );
}

export function EditorCanvas({
  section,
  mediaById,
  selectedElementId,
  onSelectElement,
  onInlineTextChange,
}: EditorCanvasProps) {
  if (!section) {
    return (
      <section className="flex h-full min-h-[480px] flex-1 items-center justify-center bg-[#131a1f] p-6">
        <div className="rounded-3xl border border-dashed border-[#2f4955] bg-[#0f171c] px-8 py-10 text-center text-[#8ea2ab]">
          Selectează o secțiune din stânga pentru editare.
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex flex-1 items-start justify-center overflow-auto bg-[radial-gradient(circle_at_50%_50%,#1a1c1c_0%,#121414_100%)] p-8 lg:p-12">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_54%_28%,rgba(102,252,241,0.09),transparent_35%)]" />

      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-[#3c4948]/30 bg-[#121414] shadow-2xl">
        <div className="flex h-10 items-center gap-2 border-b border-[#3c4948]/20 px-4">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffb4ab]/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#93d2cd]/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#62f9ee]/40" />
          <div className="mx-auto rounded-full border border-[#3c4948]/30 bg-[#1a1c1c] px-8 py-0.5 text-[10px] text-[#bacac7]">
            digitaldot.agency/preview
          </div>
        </div>

        <div className="relative min-h-[680px] bg-[#121414] px-6 py-8 sm:px-10 sm:py-10">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              background: section.settings.backgroundColor,
              borderRadius: section.settings.borderRadius,
              paddingTop: section.settings.paddingY,
              paddingBottom: section.settings.paddingY,
            }}
            className="relative rounded-3xl border border-[#62f9ee]/40 px-5 shadow-[0_0_0_1px_rgba(98,249,238,0.15)]"
          >
            <div className="absolute -top-3 left-4 rounded bg-[#62f9ee] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#003734]">
              Editing Section
            </div>
            {section.elements.map((element) => {
              const active = selectedElementId === element.id;

              if (element.type === "text") {
                return (
                  <div
                    key={element.id}
                    onClick={() => onSelectElement(element.id)}
                    className={cn(
                      "rounded-xl border border-transparent p-1 transition",
                      active && "border-[#62f9ee]/60 bg-[#62f9ee]/8",
                    )}
                  >
                    <p
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(event) => {
                        const next = event.currentTarget.textContent?.trim() ?? "";
                        if (next) {
                          onInlineTextChange(element.id, next);
                        }
                      }}
                      style={styleFromElement(element)}
                      className="outline-none"
                    >
                      {element.content}
                    </p>
                  </div>
                );
              }

              if (element.type === "media") {
                return (
                  <div
                    key={element.id}
                    onClick={() => onSelectElement(element.id)}
                    className={cn(
                      "mt-4 rounded-2xl border border-transparent p-1 transition",
                      active && "border-[#62f9ee]/60 bg-[#62f9ee]/8",
                    )}
                  >
                    <MediaPreview item={mediaById[element.mediaId]} alt={element.label} />
                    {element.caption ? (
                      <p className="mt-2 text-xs text-[#8ca0a9]">{element.caption}</p>
                    ) : null}
                  </div>
                );
              }

              if (element.type === "button") {
                return (
                  <div
                    key={element.id}
                    onClick={() => onSelectElement(element.id)}
                    className={cn(
                      "mt-4 flex rounded-full border border-transparent p-1 transition",
                      active && "border-[#62f9ee]/60 bg-[#62f9ee]/8",
                      element.style.textAlign === "center" && "justify-center",
                      element.style.textAlign === "right" && "justify-end",
                    )}
                  >
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(event) => {
                        const next = event.currentTarget.textContent?.trim() ?? "";
                        if (next) {
                          onInlineTextChange(element.id, next);
                        }
                      }}
                      style={styleFromElement(element)}
                      className="inline-flex min-w-[180px] items-center justify-center rounded-full outline-none"
                    >
                      {element.content}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={element.id}
                  onClick={() => onSelectElement(element.id)}
                  className={cn(
                    "mt-5 rounded-[1.6rem] border border-transparent p-4 transition",
                    active && "border-[#62f9ee]/60 bg-[#62f9ee]/8",
                  )}
                  style={styleFromElement(element)}
                >
                  <p className="text-3xl font-bold leading-[1.1]">{element.content}</p>
                  <p className="mt-3 text-base leading-relaxed text-[#cfd8dc]">{element.subcontent}</p>
                  <span className="mt-5 inline-flex rounded-full bg-[#66fcf1] px-5 py-3 text-sm font-semibold text-[#0a2f34]">
                    {element.buttonLabel}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
