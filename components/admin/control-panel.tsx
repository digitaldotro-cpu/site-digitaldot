"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

function formatLabel(key: string) {
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
            className="min-h-28 w-full rounded-xl border border-[#2b3d45] bg-[#0b1318] px-3 py-2 text-sm text-[#dce2e6] focus:border-[#66fcf1] focus:outline-none"
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
            className="inline-flex items-center gap-1 rounded-full border border-[#2d434c] px-3 py-1 text-xs font-semibold text-[#66fcf1]"
          >
            <Plus size={14} /> Adaugă item
          </button>
        </div>

        <div className="space-y-3">
          {value.map((item, index) => (
            <div key={`${label}-${index}`} className="rounded-xl border border-[#28414a] bg-[#101b20] p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#9bc6c3]">
                  {label} #{index + 1}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onMoveArrayItem([...path, index], "up")}
                    disabled={index === 0}
                    className="inline-flex items-center gap-1 rounded-full border border-[#2d434c] px-2 py-1 text-[11px] text-[#b7d9d7] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ↑ Sus
                  </button>
                  <button
                    type="button"
                    onClick={() => onMoveArrayItem([...path, index], "down")}
                    disabled={index === value.length - 1}
                    className="inline-flex items-center gap-1 rounded-full border border-[#2d434c] px-2 py-1 text-[11px] text-[#b7d9d7] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ↓ Jos
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveArrayItem([...path, index])}
                    disabled={value.length <= 1}
                    className="inline-flex items-center gap-1 rounded-full border border-[#473437] px-2 py-1 text-[11px] text-[#f0b5bb] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={12} /> Șterge
                  </button>
                </div>
              </div>

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
          ))}
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
      <label className="flex items-center justify-between rounded-2xl border border-[#25373f] bg-[#0f171c] p-4">
        <span className="text-sm font-semibold text-white">{label}</span>
        <input
          type="checkbox"
          checked={value}
          onChange={(event) => onChange(path, event.target.checked)}
          className="h-4 w-4 accent-[#66fcf1]"
        />
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
          className="min-h-24 w-full rounded-xl border border-[#2b3d45] bg-[#0b1318] px-3 py-2 text-sm text-[#dce2e6] focus:border-[#66fcf1] focus:outline-none"
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
          className="h-11 w-full rounded-xl border border-[#2b3d45] bg-[#0b1318] px-3 text-sm text-[#dce2e6] focus:border-[#66fcf1] focus:outline-none"
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
        <h1 className="text-3xl font-semibold text-white">Panou de control conținut</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#bfc5ca]">
          Editează orice text, listă sau secțiune din website și salvează direct în `content/site-content.json`.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <Button type="button" variant="secondary" onClick={reloadFromDisk} disabled={isReloading}>
            <RefreshCcw className={cn("mr-2 h-4 w-4", isReloading && "animate-spin")} />
            Reîncarcă
          </Button>

          <Button type="button" onClick={saveContent} disabled={isSaving || !dirty}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Salvare..." : "Salvează"}
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#8ea0aa]">
          <span>Status modificări: {dirty ? "nesalvate" : "sincronizat"}</span>
        </div>

        {status.type !== "idle" ? (
          <p
            className={cn(
              "mt-4 rounded-xl border px-4 py-2 text-sm",
              status.type === "success"
                ? "border-[#2d4a48] bg-[#112b2a] text-[#9ef7f1]"
                : "border-[#4a3033] bg-[#2f1b1d] text-[#ffc5cb]",
            )}
          >
            {status.message}
          </p>
        ) : null}
      </section>

      <div className="sticky top-4 z-10 flex flex-wrap items-center gap-2 rounded-2xl border border-[#2a3c44] bg-[#10181d]/90 px-6 py-4 shadow-lg backdrop-blur-md">
        <span className="mr-2 text-sm font-semibold text-[#8da0aa]">Secțiuni:</span>
        {Object.keys(draft).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              activeTab === key
                ? "bg-[#66fcf1] text-[#0b1318]"
                : "bg-[#1c2c33] text-[#b7d9d7] hover:bg-[#66fcf1] hover:text-[#0b1318]"
            )}
          >
            {formatLabel(key)}
          </button>
        ))}
      </div>

      <section className="space-y-6 pt-4">
        {activeTab && draft[activeTab as keyof SiteContent] && (
          <div key={activeTab}>
            <EditorNode
              label={formatLabel(activeTab)}
              value={draft[activeTab as keyof SiteContent] as JsonValue}
              path={[activeTab]}
              depth={0}
              onChange={handleChange}
              onAddArrayItem={handleAddArrayItem}
              onRemoveArrayItem={handleRemoveArrayItem}
              onMoveArrayItem={handleMoveArrayItem}
            />
          </div>
        )}
      </section>
    </div>
  );
}
