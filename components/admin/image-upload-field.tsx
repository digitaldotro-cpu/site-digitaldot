"use client";

import { useState } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ImageUploadFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ImageUploadField({ value, onChange }: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "digital-dot-cms");

    try {
      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Eroare la încărcarea imaginii.");
      }

      // The backend returns the secure_url in data.item.url
      if (data.item?.url) {
        onChange(data.item.url);
      } else {
        throw new Error("Răspuns invalid de la server.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "A apărut o eroare necunoscută.");
    } finally {
      setIsUploading(false);
      // Reset input value so the same file can be uploaded again if needed
      event.target.value = "";
    }
  }

  function handleClear() {
    onChange("");
  }

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative group overflow-hidden rounded-xl border border-[#2b3d45] bg-[#0a1014] w-fit">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="w-auto h-auto max-h-[120px] max-w-full object-contain"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
              title="Șterge imaginea"
            >
              <X size={18} />
            </button>
            <label className="bg-[#66fcf1]/80 hover:bg-[#66fcf1] text-[#0b1318] p-2 rounded-full cursor-pointer backdrop-blur-sm transition-colors" title="Înlocuiește imaginea">
              <UploadCloud size={18} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="relative">
          <label
            className={cn(
              "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
              isUploading
                ? "border-[#2b3d45] bg-[#0b1318] opacity-50 cursor-not-allowed"
                : "border-[#2b3d45] bg-[#0b1318] hover:border-[#66fcf1] hover:bg-[#10181d]"
            )}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <Loader2 className="w-8 h-8 mb-3 text-[#66fcf1] animate-spin" />
              ) : (
                <ImageIcon className="w-8 h-8 mb-3 text-[#8ea0aa]" />
              )}
              <p className="mb-2 text-sm text-[#8ea0aa]">
                {isUploading ? (
                  <span className="font-semibold text-[#66fcf1]">Se încarcă...</span>
                ) : (
                  <>
                    <span className="font-semibold text-white">Click pentru a încărca</span> o imagine
                  </>
                )}
              </p>
              {!isUploading && <p className="text-xs text-[#5c6e7a]">SVG, PNG, JPG sau WEBP</p>}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>
      )}

      {error && (
        <p className="text-xs text-[#ffc5cb] bg-[#2f1b1d] border border-[#4a3033] p-2 rounded-lg">
          {error}
        </p>
      )}

      {/* Show the raw string input below the uploader so users can manually paste URLs if they want */}
      <div className="flex gap-2 items-center">
        <span className="text-xs text-[#5c6e7a] whitespace-nowrap">URL manual:</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/cale/catre/imagine.png sau https://..."
          className="h-8 w-full rounded-lg border border-[#2b3d45] bg-[#0b1318] px-2 text-xs text-[#dce2e6] focus:border-[#66fcf1] focus:outline-none"
        />
      </div>
    </div>
  );
}
