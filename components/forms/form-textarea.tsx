"use client";

import { cn } from "@/lib/utils";

type FormTextareaProps = {
  id: string;
  label: string;
  error?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function FormTextarea({
  id,
  label,
  error,
  className,
  ...props
}: FormTextareaProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-[#dadada]">
        {label}
      </label>
      <textarea
        id={id}
        className={cn(
          "min-h-32 w-full rounded-xl border border-[#1f2a2d] bg-[#0b0c10]/86 px-4 py-3 text-sm text-white placeholder:text-[#7f8b92] transition-colors focus:border-[#66fcf1]/80 focus:outline-none focus:ring-1 focus:ring-[#66fcf1]/20",
          error && "border-[#ff7a7a]",
          className,
        )}
        {...props}
      />
      {error ? (
        <p role="alert" className="text-sm text-[#ff9a9a]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
