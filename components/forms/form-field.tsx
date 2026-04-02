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
      <label htmlFor={id} className="text-sm font-semibold text-[#d9dde0]">
        {label}
      </label>
      <input
        id={id}
        className={cn(
          "h-12 w-full rounded-2xl border border-[#2b3a42] bg-[#10171b] px-4 text-sm text-white placeholder:text-[#7f8b92] focus:border-[#66fcf1] focus:outline-none",
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
