"use client";

import { cn } from "@/lib/utils";

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function FormField({ id, label, error, className, ...props }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-[#dadada]">
        {label}
      </label>
      <input
        id={id}
        className={cn(
          "h-12 w-full rounded-xl border border-[#1f2a2d] bg-[#0b0c10]/86 px-4 text-sm text-white placeholder:text-[#7f8b92] transition-colors focus:border-[#276864]/80 focus:outline-none focus:ring-1 focus:ring-[#276864]/20",
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
