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
      <label htmlFor={id} className="text-sm font-semibold text-[#d9dde0]">
        {label}
      </label>
      <textarea
        id={id}
        className={cn(
          "min-h-32 w-full rounded-2xl border border-[#2b3a42] bg-[#10171b] px-4 py-3 text-sm text-white placeholder:text-[#7f8b92] focus:border-[#66fcf1] focus:outline-none",
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
