"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { MediaItem, SectionType } from "@/types/cms";
import { Modal } from "@/components/cms/ui/modal";
import { FieldError, FieldLabel, Input, Select } from "@/components/cms/ui/form-controls";

const addSectionSchema = z.object({
  name: z.string().min(2, "Numele secțiunii este obligatoriu."),
  type: z.enum(["hero", "text-image", "gallery", "cta", "testimonials", "blog-preview"]),
  mediaId: z.string().optional(),
});

type AddSectionValues = z.infer<typeof addSectionSchema>;

type AddSectionModalProps = {
  open: boolean;
  media: MediaItem[];
  onClose: () => void;
  onConfirm: (values: { name: string; type: SectionType; mediaId?: string }) => void;
};

const options: Array<{ type: SectionType; label: string }> = [
  { type: "hero", label: "Hero" },
  { type: "text-image", label: "Text + Image" },
  { type: "gallery", label: "Gallery" },
  { type: "cta", label: "CTA" },
  { type: "testimonials", label: "Testimonials" },
  { type: "blog-preview", label: "Blog Preview" },
];

export function AddSectionModal({ open, media, onClose, onConfirm }: AddSectionModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddSectionValues>({
    resolver: zodResolver(addSectionSchema),
    defaultValues: {
      name: "Secțiune nouă",
      type: "text-image",
      mediaId: "",
    },
  });

  return (
    <Modal
      open={open}
      title="Adaugă secțiune"
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-full border border-[#28404b] px-4 text-sm text-[#a2b4bc] transition hover:border-[#66fcf1]/60 hover:text-[#66fcf1]"
          >
            Anulează
          </button>
          <button
            type="button"
            onClick={handleSubmit((values) => {
              onConfirm({
                name: values.name,
                type: values.type,
                mediaId: values.mediaId || undefined,
              });
              onClose();
              reset();
            })}
            className="h-10 rounded-full bg-[#66fcf1] px-4 text-sm font-semibold text-[#063037] transition hover:bg-[#90fff8]"
          >
            Adaugă
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <FieldLabel>Nume secțiune</FieldLabel>
          <Input {...register("name")} />
          <FieldError message={errors.name?.message} />
        </div>

        <div className="space-y-2">
          <FieldLabel>Tip secțiune</FieldLabel>
          <Select {...register("type")}>
            {options.map((option) => (
              <option key={option.type} value={option.type}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <FieldLabel>Media implicită (opțional)</FieldLabel>
          <Select {...register("mediaId")}>
            <option value="">Fără media</option>
            {media.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </Modal>
  );
}
