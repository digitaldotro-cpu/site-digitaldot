"use client";

import { useEffect, useMemo, useRef } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { AlignCenter, AlignLeft, AlignRight, Trash2 } from "lucide-react";
import type { MediaItem, SectionElement, TextAlign } from "@/types/cms";
import { PanelTitle, FieldLabel, FieldError, Input, Select } from "@/components/cms/ui/form-controls";
import { cn } from "@/lib/utils";

const elementEditorSchema = z.object({
  label: z.string().min(1, "Numele elementului este necesar."),
  content: z.string().optional(),
  subcontent: z.string().optional(),
  buttonLabel: z.string().optional(),
  buttonHref: z.string().optional(),
  href: z.string().optional(),
  mediaId: z.string().optional(),
  caption: z.string().optional(),
  fontSize: z.number().min(10).max(120),
  fontWeight: z.number().min(100).max(900),
  textAlign: z.enum(["left", "center", "right"]),
  color: z.string().min(4),
  backgroundColor: z.string().min(4),
  padding: z.number().min(0).max(200),
  margin: z.number().min(0).max(200),
  borderRadius: z.number().min(0).max(999),
});

type ElementEditorValues = z.infer<typeof elementEditorSchema>;

type EditPanelProps = {
  element?: SectionElement;
  media: MediaItem[];
  onUpdate: (nextElement: SectionElement) => void;
  onAddElement: (type: SectionElement["type"]) => void;
  onDelete: () => void;
};

const colorPalette = ["#ffffff", "#66fcf1", "#276864", "#c6c6c6", "#61727a"];

function toFormValues(element?: SectionElement): ElementEditorValues {
  if (!element) {
    return {
      label: "",
      content: "",
      subcontent: "",
      buttonLabel: "",
      buttonHref: "",
      href: "",
      mediaId: "",
      caption: "",
      fontSize: 18,
      fontWeight: 500,
      textAlign: "left",
      color: "#ffffff",
      backgroundColor: "transparent",
      padding: 0,
      margin: 0,
      borderRadius: 0,
    };
  }

  return {
    label: element.label,
    content: "content" in element ? element.content : "",
    subcontent: element.type === "cta" ? element.subcontent : "",
    buttonLabel: element.type === "cta" ? element.buttonLabel : "",
    buttonHref: element.type === "cta" ? element.buttonHref : "",
    href: element.type === "button" ? element.href : "",
    mediaId: element.type === "media" ? element.mediaId : "",
    caption: element.type === "media" ? element.caption ?? "" : "",
    fontSize: element.style.fontSize,
    fontWeight: element.style.fontWeight,
    textAlign: element.style.textAlign,
    color: element.style.color,
    backgroundColor: element.style.backgroundColor,
    padding: element.style.padding,
    margin: element.style.margin,
    borderRadius: element.style.borderRadius,
  };
}

function buildElement(element: SectionElement, values: ElementEditorValues): SectionElement {
  const sharedStyle = {
    ...element.style,
    fontSize: values.fontSize,
    fontWeight: values.fontWeight,
    textAlign: values.textAlign,
    color: values.color,
    backgroundColor: values.backgroundColor,
    padding: values.padding,
    margin: values.margin,
    borderRadius: values.borderRadius,
  };

  switch (element.type) {
    case "text":
      return {
        ...element,
        label: values.label,
        content: values.content ?? "",
        style: sharedStyle,
      };
    case "button":
      return {
        ...element,
        label: values.label,
        content: values.content ?? "",
        href: values.href?.trim() || "/",
        style: sharedStyle,
      };
    case "media":
      return {
        ...element,
        label: values.label,
        mediaId: values.mediaId?.trim() || "",
        caption: values.caption?.trim() || "",
        style: sharedStyle,
      };
    case "cta":
      return {
        ...element,
        label: values.label,
        content: values.content ?? "",
        subcontent: values.subcontent ?? "",
        buttonLabel: values.buttonLabel?.trim() || "Buton",
        buttonHref: values.buttonHref?.trim() || "/contacteaza-ne",
        style: sharedStyle,
      };
    default:
      return element;
  }
}

const alignmentOptions: Array<{ value: TextAlign; icon: React.ComponentType<{ className?: string }> }> = [
  { value: "left", icon: AlignLeft },
  { value: "center", icon: AlignCenter },
  { value: "right", icon: AlignRight },
];

export function EditPanel({ element, media, onUpdate, onAddElement, onDelete }: EditPanelProps) {
  const elementDefaults = useMemo(() => toFormValues(element), [element]);
  const previousElementIdRef = useRef<string | undefined>(element?.id);
  const lastAppliedSnapshotRef = useRef<string>("");

  const {
    register,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ElementEditorValues>({
    resolver: zodResolver(elementEditorSchema),
    mode: "onChange",
    defaultValues: elementDefaults,
  });

  useEffect(() => {
    const nextId = element?.id;

    if (previousElementIdRef.current !== nextId) {
      previousElementIdRef.current = nextId;
      const nextDefaults = toFormValues(element);
      lastAppliedSnapshotRef.current = JSON.stringify(nextDefaults);
      reset(nextDefaults);
    }
  }, [element, reset]);

  const values = useWatch({ control });

  useEffect(() => {
    if (!element) {
      return;
    }

    const parsed = elementEditorSchema.safeParse(values);

    if (!parsed.success) {
      return;
    }

    const snapshot = JSON.stringify(parsed.data);
    if (snapshot === lastAppliedSnapshotRef.current) {
      return;
    }

    lastAppliedSnapshotRef.current = snapshot;

    const nextElement = buildElement(element, parsed.data);
    if (JSON.stringify(nextElement) !== JSON.stringify(element)) {
      onUpdate(nextElement);
    }
  }, [element, onUpdate, values]);

  if (!element) {
    return (
      <aside className="w-full border-t border-[#3c4948]/20 bg-[#1e2020] p-6 lg:h-full lg:w-80 lg:border-l lg:border-t-0">
        <PanelTitle>Element Settings</PanelTitle>
        <p className="mt-4 text-sm text-[#bacac7]">Selectează un element din preview pentru a-l edita.</p>
      </aside>
    );
  }

  const fontSize = values.fontSize ?? elementDefaults.fontSize;
  const currentColor = values.color ?? elementDefaults.color;
  const currentAlignment = values.textAlign ?? elementDefaults.textAlign;

  return (
    <aside className="w-full border-t border-[#3c4948]/20 bg-[#1e2020] p-6 lg:h-full lg:w-80 lg:border-l lg:border-t-0">
      <PanelTitle>Element Settings</PanelTitle>

      <div className="mt-5 space-y-4">
        <div className="space-y-2">
          <FieldLabel>Label intern</FieldLabel>
          <Input {...register("label")} />
          <FieldError message={errors.label?.message} />
        </div>

        {element.type !== "media" ? (
          <div className="space-y-2">
            <FieldLabel>Content</FieldLabel>
            <Input {...register("content")} />
          </div>
        ) : null}

        {element.type === "cta" ? (
          <>
            <div className="space-y-2">
              <FieldLabel>Subtext</FieldLabel>
              <Input {...register("subcontent")} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <FieldLabel>CTA Label</FieldLabel>
                <Input {...register("buttonLabel")} />
              </div>
              <div className="space-y-2">
                <FieldLabel>CTA Link</FieldLabel>
                <Input {...register("buttonHref")} />
              </div>
            </div>
          </>
        ) : null}

        {element.type === "button" ? (
          <div className="space-y-2">
            <FieldLabel>Button Link</FieldLabel>
            <Input {...register("href")} />
          </div>
        ) : null}

        {element.type === "media" ? (
          <>
            <div className="space-y-2">
              <FieldLabel>Media</FieldLabel>
              <Select {...register("mediaId")}>
                <option value="">Alege media</option>
                {media.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <FieldLabel>Caption</FieldLabel>
              <Input {...register("caption")} />
            </div>
          </>
        ) : null}
      </div>

      <div className="mt-6 space-y-4 rounded-xl border border-[#3c4948]/20 bg-[#0d0e0f] p-4">
        <div className="flex items-center justify-between">
          <FieldLabel>Font Size</FieldLabel>
          <span className="text-xs font-semibold text-[#66fcf1]">{fontSize}px</span>
        </div>
        <input
          type="range"
          min={10}
          max={120}
          value={fontSize}
          onChange={(event) => setValue("fontSize", Number(event.target.value), { shouldValidate: true })}
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[#333535] accent-[#62f9ee]"
        />

        <div className="space-y-2">
          <FieldLabel>Weight</FieldLabel>
          <Select {...register("fontWeight", { valueAsNumber: true })}>
            <option value={400}>Regular (400)</option>
            <option value={500}>Medium (500)</option>
            <option value={600}>SemiBold (600)</option>
            <option value={700}>Bold (700)</option>
            <option value={800}>Extra Bold (800)</option>
          </Select>
        </div>

        <div className="space-y-2">
          <FieldLabel>Text Color</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {colorPalette.map((color) => {
              const active = currentColor === color;

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue("color", color, { shouldValidate: true })}
                  className={cn(
                    "h-8 w-8 rounded-full border transition",
                    active ? "border-[#66fcf1] shadow-[0_0_0_2px_rgba(102,252,241,0.25)]" : "border-transparent",
                  )}
                  style={{ background: color }}
                  aria-label={`Selectează ${color}`}
                />
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <FieldLabel>Alignment</FieldLabel>
          <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#121414] p-1">
            {alignmentOptions.map((item) => {
              const Icon = item.icon;
              const active = currentAlignment === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setValue("textAlign", item.value, { shouldValidate: true })}
                  className={cn(
                    "inline-flex h-9 items-center justify-center rounded-full transition",
                    active ? "bg-[#123643] text-[#66fcf1]" : "text-[#7a909b] hover:text-white",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <FieldLabel>Padding</FieldLabel>
            <Input type="number" min={0} max={200} {...register("padding", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <FieldLabel>Margin</FieldLabel>
            <Input type="number" min={0} max={200} {...register("margin", { valueAsNumber: true })} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <FieldLabel>Radius</FieldLabel>
            <Input type="number" min={0} max={999} {...register("borderRadius", { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <FieldLabel>BG Color</FieldLabel>
            <Input {...register("backgroundColor")} />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onAddElement("text")}
        className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-xl border border-[#3c4948]/40 text-xs font-semibold uppercase tracking-[0.15em] text-[#bacac7] transition hover:border-[#62f9ee]/70 hover:text-[#62f9ee]"
      >
        Add Text
      </button>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onAddElement("media")}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-[#3c4948]/40 text-xs font-semibold uppercase tracking-[0.12em] text-[#bacac7] transition hover:border-[#62f9ee]/70 hover:text-[#62f9ee]"
        >
          Add Media
        </button>
        <button
          type="button"
          onClick={() => onAddElement("button")}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-[#3c4948]/40 text-xs font-semibold uppercase tracking-[0.12em] text-[#bacac7] transition hover:border-[#62f9ee]/70 hover:text-[#62f9ee]"
        >
          Add Button
        </button>
      </div>

      <button
        type="button"
        className="mt-3 inline-flex h-10 w-full items-center justify-between rounded-xl px-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#bacac7] transition hover:text-white"
      >
        <span>Advanced Settings</span>
        <span className="text-[10px]">›</span>
      </button>

      <button
        type="button"
        onClick={onDelete}
        className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#93000a]/25 text-xs font-semibold uppercase tracking-[0.16em] text-[#ffb4ab] transition hover:bg-[#93000a]/35"
      >
        <Trash2 className="h-4 w-4" />
        Delete Element
      </button>
    </aside>
  );
}
