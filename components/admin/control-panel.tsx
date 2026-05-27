"use client";

import Link from "next/link";
import Image from "next/image";

import { useMemo, useRef, useState } from "react";
import { Plus, RefreshCcw, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import type { SiteContent } from "@/lib/site-content-schema";
import { cn } from "@/lib/utils";

type Path = Array<string | number>;
type JsonPrimitive = string | number | boolean | null;
type JsonObject = { [key: string]: JsonValue };
type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

type EditorProps = {
  label: string;
  value: JsonValue;
  path: Path;
  depth: number;
  onChange: (path: Path, nextValue: JsonValue) => void;
  onAddArrayItem: (path: Path) => void;
  onRemoveArrayItem: (path: Path) => void;
  onMoveArrayItem: (path: Path, direction: "up" | "down") => void;
};

function isObject(value: JsonValue): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPrimitive(value: JsonValue): value is JsonPrimitive {
  return !Array.isArray(value) && !isObject(value);
}

function getItemTitle(value: JsonValue) {
  if (!isObject(value)) {
    return null;
  }

  const titleKeys = ["name", "title", "label", "heading"] as const;
  for (const key of titleKeys) {
    const candidate = value[key];
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate;
    }
  }

  return null;
}

const labelDictionary: Record<string, string> = {
  hero: "Secțiunea Hero",
  positioning: "Poziționare",
  proofMetrics: "Metrici Proof",
  miniCaseStudy: "Mini Studiu de Caz",
  proofCta: "CTA Intermediar",
  authority: "Autoritate",
  brandValueSection: "Valori Brand",
  services: "Servicii",
  portfolioExamples: "Portofoliu Exemple",
  instagramSection: "Secțiune Instagram",
  strategySection: "Strategie",
  teamSection: "Echipă",
  process: "Proces",
  clientFilter: "Filtru Clienți",
  partnersSection: "Parteneri",
  primaryCta: "Buton Principal (CTA)",
  contact: "Contact",
  seoTitle: "Titlu SEO",
  seoDescription: "Descriere SEO",
  ogTitle: "Titlu Open Graph",
  ogDescription: "Descriere Open Graph",
  ogImage: "Imagine Open Graph",
  canonicalUrl: "URL Canonic",
  seoSettings: "SEO Settings",
  editorialSeo: "SEO Editorial",
  blogTitle: "Titlu Blog",
  blogDescription: "Descriere Blog",
  authors: "Autori",
  topicClusters: "Clustere Tematice",
  articleRegistry: "Registru Articole",
  caseStudyRegistry: "Registru Case Studies",
  serviceSeo: "SEO Servicii",
  serviceLinksTitle: "Titlu Linkuri Servicii",
  serviceLinks: "Linkuri Servicii",
  resourceLinksTitle: "Titlu Resurse",
  resourceLinks: "Linkuri Resurse",
  explanationTitle: "Titlu Explicație Serviciu",
  explanationParagraphs: "Paragrafe Explicație",
  problemsTitle: "Titlu Probleme",
  problems: "Probleme Comune",
  approachTitle: "Titlu Abordare",
  approachIntro: "Introducere Abordare",
  approachSteps: "Pași Abordare",
  authorityTitle: "Titlu Autoritate",
  authorityParagraphs: "Paragrafe Autoritate",
  relatedTitle: "Titlu Linkuri Relaționate",
  relatedLinks: "Linkuri Relaționate",
  ctaLabel: "Text Buton CTA",
  ctaHref: "Link Buton CTA",
  regionalSeo: "SEO Regional",
  hub: "Hub Regional",
  pages: "Pagini Regionale",
  cityName: "Oraș",
  countyName: "Județ",
  regionalContext: "Context Regional",
  sectors: "Sectoare",
  worksWith: "Cu Cine Lucrăm",
  criteria: "Criterii",
  faqs: "FAQ",
  cta: "CTA",
  internalLinks: "Linkuri Interne",
  defaultKeywords: "Cuvinte Cheie",
  defaultOgImage: "Imagine OG Implicită",
  canonicalBaseUrl: "Domeniu Canonic",
  aiSeo: "AI SEO",
  llmsTxt: "Editor llms.txt",
  allowedCrawlers: "Crawler AI Permiși",
  semanticKeywordGroups: "Grupuri Semantice",
  structuredData: "Structured Data",
  organizationName: "Nume Organizație",
  legalName: "Nume Legal",
  websiteUrl: "URL Website",
  address: "Adresă",
  assignedPaths: "Pagini Asociate",
  question: "Întrebare",
  answer: "Răspuns",
  sectionOrder: "Ordine Secțiuni",
  caseStudies: "Studii de Caz",
  global: "Global",
  landing: "Landing Page",
  privacyPolicy: "Politică de Confidențialitate",
  termsConditions: "Termeni și Condiții",
  brandName: "Nume Brand",
  gtmId: "Google Tag Manager ID",
  headerLogo: "Logo Antet",
  favicon: "Favicon",
  navbarCtaLabel: "Etichetă Buton Meniu",
  navbarCtaHref: "Link Buton Meniu",
  navigation: "Navigare",
  scrollBehavior: "Comportament Scroll",
  whatsappButton: "Buton WhatsApp",
  callButton: "Buton Apel",
  footer: "Subsol (Footer)",
  socialLinksTitle: "Titlu Rețele Sociale",
  socialLinks: "Rețele Sociale",
  regionalLinksTitle: "Titlu Linkuri Regionale",
  regionalLinks: "Linkuri Regionale",
  legalLinksTitle: "Titlu Linkuri Legale",
  legalLinks: "Linkuri Legale",
  contactTitle: "Titlu Contact",
  contactEmail: "Email Contact",
  contactPhone: "Telefon Contact",
  contactLocation: "Locație Contact",
  copyrightTemplate: "Text Copyright",
  badge: "Ecuson (Badge)",
  heading: "Titlu",
  subheading: "Subtitlu",
  buttonText: "Text Buton",
  buttonLink: "Link Buton",
  description: "Descriere",
  title: "Titlu Secțiune",
};

function formatLabel(key: string) {
  if (labelDictionary[key]) return labelDictionary[key];
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/-/g, " ")
    .replace(/^./, (char) => char.toUpperCase());
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function getIn(value: JsonValue, path: Path): JsonValue {
  return path.reduce<JsonValue>((acc, segment) => {
    if (Array.isArray(acc)) {
      return acc[segment as number] as JsonValue;
    }

    if (isObject(acc)) {
      return acc[segment as string] as JsonValue;
    }

    return acc;
  }, value);
}

function setIn(value: JsonValue, path: Path, next: JsonValue): JsonValue {
  if (path.length === 0) {
    return next;
  }

  const [segment, ...rest] = path;

  if (Array.isArray(value)) {
    const clone = [...value];
    const index = segment as number;
    clone[index] = setIn(clone[index] as JsonValue, rest, next);
    return clone;
  }

  if (isObject(value)) {
    const clone: JsonObject = { ...value };
    const key = segment as string;
    clone[key] = setIn(clone[key] as JsonValue, rest, next);
    return clone;
  }

  return value;
}

function removeAtPath(value: JsonValue, path: Path): JsonValue {
  const parentPath = path.slice(0, -1);
  const indexToRemove = path[path.length - 1] as number;
  const parent = getIn(value, parentPath);

  if (!Array.isArray(parent)) {
    return value;
  }

  const nextParent = parent.filter((_, index) => index !== indexToRemove);
  return setIn(value, parentPath, nextParent);
}

function moveAtPath(value: JsonValue, path: Path, direction: "up" | "down"): JsonValue {
  const parentPath = path.slice(0, -1);
  const index = path[path.length - 1] as number;
  const parent = getIn(value, parentPath);

  if (!Array.isArray(parent)) {
    return value;
  }

  const nextIndex = direction === "up" ? index - 1 : index + 1;
  if (nextIndex < 0 || nextIndex >= parent.length) {
    return value;
  }

  const clone = [...parent];
  const [item] = clone.splice(index, 1);
  clone.splice(nextIndex, 0, item as JsonValue);

  return setIn(value, parentPath, clone);
}

function EditorNode({
  label,
  value,
  path,
  depth,
  onChange,
  onAddArrayItem,
  onRemoveArrayItem,
  onMoveArrayItem,
}: EditorProps) {
  if (Array.isArray(value)) {
    const primitiveArray = value.every(isPrimitive);

    if (primitiveArray) {
      const current = value as JsonPrimitive[];
      const firstType = typeof current[0];

      return (
        <div className="space-y-2 rounded-2xl border border-[#25373f] bg-[#0f171c] p-4">
          <label className="text-sm font-semibold text-white">{label}</label>
          <textarea
            value={current.map((item) => String(item ?? "")).join("\n")}
            onChange={(event) => {
              const lines = event.target.value
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean);

              const next = lines.map((line) => {
                if (firstType === "number") {
                  const numberValue = Number(line);
                  return Number.isNaN(numberValue) ? 0 : numberValue;
                }

                if (firstType === "boolean") {
                  return line.toLowerCase() === "true";
                }

                return line;
              });

              onChange(path, next);
            }}
            className="min-h-28 w-full rounded-xl border border-[#2b3d45] bg-[#0b1318] px-3 py-2 text-sm text-[#dce2e6] focus:border-[#276864] focus:outline-none"
          />
          <p className="text-xs text-[#8e99a1]">Elementele din listă sunt separate prin rânduri noi.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3 rounded-2xl border border-[#25373f] bg-[#0f171c] p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">{label}</p>
          <button
            type="button"
            onClick={() => onAddArrayItem(path)}
            className="inline-flex items-center gap-1 rounded-full border border-[#2d434c] px-3 py-1 text-xs font-semibold text-[#d8c7a3]"
          >
            <Plus size={14} /> Adaugă item
          </button>
        </div>

        <div className="space-y-3">
          {value.map((item, index) => {
            const itemTitle = getItemTitle(item as JsonValue);
            const displayTitle = itemTitle ? `${itemTitle} (#${index + 1})` : `${label} #${index + 1}`;

            return (
              <details key={`${label}-${index}`} className="rounded-xl border border-[#28414a] bg-[#101b20] group [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-3 cursor-pointer select-none">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#9bc6c3]">
                    {displayTitle}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); e.preventDefault(); onMoveArrayItem([...path, index], "up"); }}
                      disabled={index === 0}
                      className="inline-flex items-center gap-1 rounded-full border border-[#2d434c] px-2 py-1 text-[11px] text-[#b7d9d7] hover:bg-[#1c2c33] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      ↑ Sus
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); e.preventDefault(); onMoveArrayItem([...path, index], "down"); }}
                      disabled={index === value.length - 1}
                      className="inline-flex items-center gap-1 rounded-full border border-[#2d434c] px-2 py-1 text-[11px] text-[#b7d9d7] hover:bg-[#1c2c33] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      ↓ Jos
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); e.preventDefault(); onRemoveArrayItem([...path, index]); }}
                      disabled={value.length <= 1}
                      className="inline-flex items-center gap-1 rounded-full border border-[#473437] px-2 py-1 text-[11px] text-[#f0b5bb] hover:bg-[#2f1b1d] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={12} /> Șterge
                    </button>
                  </div>
                </summary>
  
                <div className="p-3 border-t border-[#28414a]">
                  <EditorNode
                    label={`${label} item`}
                    value={item as JsonValue}
                    path={[...path, index]}
                    depth={depth + 1}
                    onChange={onChange}
                    onAddArrayItem={onAddArrayItem}
                    onRemoveArrayItem={onRemoveArrayItem}
                    onMoveArrayItem={onMoveArrayItem}
                  />
                </div>
              </details>
            );
          })}
        </div>
      </div>
    );
  }

  if (isObject(value)) {
    return (
      <details open={depth < 2} className="rounded-2xl border border-[#25373f] bg-[#0f171c] p-4">
        <summary className="cursor-pointer text-sm font-semibold text-white">{label}</summary>
        <div className="mt-4 space-y-3">
          {Object.entries(value).map(([key, child]) => (
            <EditorNode
              key={key}
              label={formatLabel(key)}
              value={child as JsonValue}
              path={[...path, key]}
              depth={depth + 1}
              onChange={onChange}
              onAddArrayItem={onAddArrayItem}
              onRemoveArrayItem={onRemoveArrayItem}
              onMoveArrayItem={onMoveArrayItem}
            />
          ))}
        </div>
      </details>
    );
  }

  if (typeof value === "boolean") {
    return (
      <label className="flex items-center justify-between rounded-2xl border border-[#25373f] bg-[#0f171c] p-4 cursor-pointer hover:bg-[#151d22] transition-colors group">
        <span className="text-sm font-semibold text-white group-hover:text-[#d8c7a3] transition-colors">{label}</span>
        <div className="relative">
          <input
            type="checkbox"
            checked={value}
            onChange={(event) => onChange(path, event.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-[#25373f] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#0f171c] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#8da0aa] after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#276864] peer-checked:after:bg-[#0f171c]"></div>
        </div>
      </label>
    );
  }

  const isLongText = typeof value === "string" && value.length > 90;
  const keyName = String(path[path.length - 1]);
  const isImageField =
    typeof value === "string" &&
    (keyName.toLowerCase().includes("image") ||
      keyName.toLowerCase().includes("logo") ||
      keyName.toLowerCase().includes("avatar") ||
      keyName.toLowerCase().includes("favicon") ||
      keyName === "src");

  return (
    <div className="space-y-2 rounded-2xl border border-[#25373f] bg-[#0f171c] p-4">
      <label className="text-sm font-semibold text-white">{label}</label>
      {isImageField ? (
        <ImageUploadField value={value as string} onChange={(val) => onChange(path, val)} />
      ) : isLongText ? (
        <textarea
          value={String(value ?? "")}
          onChange={(event) => onChange(path, event.target.value)}
          className="min-h-24 resize-y w-full rounded-xl border border-[#2b3d45] bg-[#0b1318] px-3 py-2 text-sm text-[#dce2e6] focus:border-[#276864] focus:outline-none"
        />
      ) : (
        <input
          type={typeof value === "number" ? "number" : "text"}
          value={String(value ?? "")}
          onChange={(event) => {
            if (typeof value === "number") {
              onChange(path, Number(event.target.value));
              return;
            }

            onChange(path, event.target.value);
          }}
          className="h-11 w-full rounded-xl border border-[#2b3d45] bg-[#0b1318] px-3 text-sm text-[#dce2e6] focus:border-[#276864] focus:outline-none"
        />
      )}
    </div>
  );
}

type ControlPanelProps = {
  initialContent: SiteContent;
};

export function ControlPanel({ initialContent }: ControlPanelProps) {
  const initialRef = useRef(initialContent);
  const [draft, setDraft] = useState<SiteContent>(initialContent);
  const [activeTab, setActiveTab] = useState<string>(Object.keys(initialContent)[0] || "");
  const [activeSubTab, setActiveSubTab] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message?: string }>({
    type: "idle",
  });

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(initialRef.current),
    [draft],
  );

  function handleChange(path: Path, nextValue: JsonValue) {
    setDraft((current) => setIn(current as JsonValue, path, nextValue) as SiteContent);
  }

  function handleAddArrayItem(path: Path) {
    setDraft((current) => {
      const target = getIn(current as JsonValue, path);

      if (!Array.isArray(target)) {
        return current;
      }

      const template: JsonValue = target.length > 0 ? deepClone(target[target.length - 1]) : "";
      const next = [...target, template];
      return setIn(current as JsonValue, path, next) as SiteContent;
    });
  }

  function handleRemoveArrayItem(path: Path) {
    setDraft((current) => removeAtPath(current as JsonValue, path) as SiteContent);
  }

  function handleMoveArrayItem(path: Path, direction: "up" | "down") {
    setDraft((current) => moveAtPath(current as JsonValue, path, direction) as SiteContent);
  }

  async function saveContent() {
    setIsSaving(true);
    setStatus({ type: "idle" });

    try {
      const response = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(draft),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        if (response.status === 401) {
          window.location.reload(); // Force reload to show login screen
        }
        setStatus({ type: "error", message: data.message ?? "Nu am putut salva conținutul." });
        return;
      }

      initialRef.current = deepClone(draft);
      setStatus({ type: "success", message: data.message ?? "Conținut salvat." });
    } catch {
      setStatus({ type: "error", message: "A apărut o eroare de rețea la salvare." });
    } finally {
      setIsSaving(false);
    }
  }

  async function reloadFromDisk() {
    setIsReloading(true);
    setStatus({ type: "idle" });

    try {
      const response = await fetch("/api/admin/site-content");

      const data = (await response.json()) as SiteContent & { message?: string };

      if (!response.ok) {
        if (response.status === 401) {
          window.location.reload();
        }
        setStatus({ type: "error", message: data.message ?? "Nu am putut reîncărca conținutul." });
        return;
      }

      setDraft(data);
      initialRef.current = deepClone(data);
      setStatus({ type: "success", message: "Conținut reîncărcat din fișier." });
    } catch {
      setStatus({ type: "error", message: "A apărut o eroare la reîncărcare." });
    } finally {
      setIsReloading(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[1.8rem] border border-[#2a3c44] bg-[#10181d] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold text-white">Panou de control conținut</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#bfc5ca]">
              Editează orice text, listă sau secțiune din website și salvează direct în `content/site-content.json`.
            </p>
          </div>
          <Link 
            href="/" 
            className="shrink-0 flex items-center justify-center p-3 rounded-2xl bg-[#1c2c33] border border-[#2a3c44] transition-all hover:bg-[#25373f] hover:border-[#276864]"
            title="Înapoi pe site"
          >
            <Image
              src="/branding/logo-primary.png"
              alt="Digital Dot Logo"
              width={120}
              height={34}
              unoptimized
              className="h-6 w-auto"
            />
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#8ea0aa]">
          <span>Status modificări: <span className={dirty ? "text-[#f0b5bb]" : "text-[#9bc6c3]"}>{dirty ? "Nesalvate" : "Sincronizat"}</span></span>
        </div>

        {status.type !== "idle" ? (
          <p
            className={cn(
              "mt-4 rounded-xl border px-4 py-2 text-sm",
              status.type === "success"
                ? "border-[#2d4a48] bg-[#112b2a] text-[#d8c7a3]"
                : "border-[#4a3033] bg-[#2f1b1d] text-[#ffc5cb]",
            )}
          >
            {status.message}
          </p>
        ) : null}
      </section>

      <div className="sticky top-4 z-20 flex flex-wrap items-center gap-2 rounded-2xl border border-[#2a3c44] bg-[#10181d]/90 px-6 py-4 shadow-lg backdrop-blur-md">
        <span className="mr-2 text-sm font-semibold text-[#8da0aa]">Secțiuni:</span>
        {Object.keys(draft).map((key) => (
          <button
            key={key}
            onClick={() => {
              setActiveTab(key);
              setActiveSubTab(""); // Reset sub-tab
            }}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              activeTab === key
                ? "bg-[#276864] text-[#d8c7a3]"
                : "bg-[#1c2c33] text-[#b7d9d7] hover:bg-[#276864] hover:text-[#d8c7a3]"
            )}
          >
            {formatLabel(key)}
          </button>
        ))}
      </div>

      {(() => {
        const activeSectionData = draft[activeTab as keyof SiteContent];
        const sectionIsObject =
          typeof activeSectionData === "object" &&
          activeSectionData !== null &&
          !Array.isArray(activeSectionData);
        const sectionObject = sectionIsObject
          ? (activeSectionData as Record<string, unknown>)
          : null;
        const primitiveKeys = sectionObject
          ? Object.keys(sectionObject).filter((key) => {
              const value = sectionObject[key];
              return typeof value !== "object" || Array.isArray(value) || value === null;
            })
          : [];
        const objectKeys = sectionObject
          ? Object.keys(sectionObject).filter((key) => {
              const value = sectionObject[key];
              return typeof value === "object" && !Array.isArray(value) && value !== null;
            })
          : [];
        const hasPrimitives = primitiveKeys.length > 0;
        const subTabKeys = hasPrimitives ? ["general", ...objectKeys] : objectKeys;
        const currentSubTab = activeSubTab && subTabKeys.includes(activeSubTab) ? activeSubTab : subTabKeys[0];

        return (
          <>
            {sectionIsObject && subTabKeys.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-4 px-6">
                {subTabKeys.map(key => (
                  <button
                    key={key}
                    onClick={() => setActiveSubTab(key)}
                    className={cn(
                      "rounded-lg px-4 py-2 text-xs font-semibold transition-colors",
                      currentSubTab === key
                        ? "bg-[#25373f] text-white"
                        : "bg-transparent text-[#8da0aa] hover:bg-[#1c2c33] hover:text-[#dce2e6]"
                    )}
                  >
                    {key === "general" ? "Setări Generale" : formatLabel(key)}
                  </button>
                ))}
              </div>
            )}

            <section className="space-y-6 pt-4">
              {activeTab && activeSectionData && (
                <div key={`${activeTab}-${currentSubTab}`}>
                  {sectionIsObject && currentSubTab && sectionObject ? (
                    currentSubTab === "general" ? (
                      <div className="space-y-6">
                        {primitiveKeys.map(key => (
                          <EditorNode
                            key={key}
                            label={formatLabel(key)}
                            value={sectionObject[key] as JsonValue}
                            path={[activeTab, key]}
                            depth={0}
                            onChange={handleChange}
                            onAddArrayItem={handleAddArrayItem}
                            onRemoveArrayItem={handleRemoveArrayItem}
                            onMoveArrayItem={handleMoveArrayItem}
                          />
                        ))}
                      </div>
                    ) : (
                      <EditorNode
                        label={formatLabel(currentSubTab)}
                        value={sectionObject[currentSubTab] as JsonValue}
                        path={[activeTab, currentSubTab]}
                        depth={0}
                        onChange={handleChange}
                        onAddArrayItem={handleAddArrayItem}
                        onRemoveArrayItem={handleRemoveArrayItem}
                        onMoveArrayItem={handleMoveArrayItem}
                      />
                    )
                  ) : (
                    <EditorNode
                      label={formatLabel(activeTab)}
                      value={activeSectionData as JsonValue}
                      path={[activeTab]}
                      depth={0}
                      onChange={handleChange}
                      onAddArrayItem={handleAddArrayItem}
                      onRemoveArrayItem={handleRemoveArrayItem}
                      onMoveArrayItem={handleMoveArrayItem}
                    />
                  )}
                </div>
              )}
            </section>
          </>
        );
      })()}

      {dirty && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-[#2a3c44] bg-[#10181d]/95 px-4 py-3 shadow-[0_0_40px_rgba(39,104,100,0.1)] backdrop-blur-md transition-all animate-in slide-in-from-bottom-10 fade-in duration-300">
          <span className="text-xs font-semibold text-[#8ea0aa] hidden sm:inline-block mr-2">
            Ai modificări nesalvate
          </span>
          <Button type="button" variant="secondary" size="sm" onClick={reloadFromDisk} disabled={isReloading} className="rounded-full bg-[#1c2c33] text-[#b7d9d7] hover:bg-[#25373f] hover:text-white border-0">
            <RefreshCcw className={cn("mr-2 h-3 w-3", isReloading && "animate-spin")} />
            Anulează
          </Button>

          <Button type="button" size="sm" onClick={saveContent} disabled={isSaving} className="rounded-full bg-[#276864] text-[#d8c7a3] hover:bg-[#2f7773] font-semibold px-6 shadow-[0_0_15px_rgba(39,104,100,0.4)]">
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Se salvează..." : "Salvează"}
          </Button>
        </div>
      )}
    </div>
  );
}
