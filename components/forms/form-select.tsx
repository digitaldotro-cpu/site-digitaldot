"use client";

import { cn } from "@/lib/utils";

type Option = {
  value: string;
  label: string;
};

type FormSelectProps = {
  id: string;
  label: string;
  options: Option[];
  error?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export function FormSelect({
  id,
  label,
  options,
  error,
  className,
  ...props
}: FormSelectProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-[#dadada]">
        {label}
      </label>
      <select
        id={id}
        className={cn(
          "h-12 w-full rounded-xl border border-[#1f2a2d] bg-[#0b0c10] px-4 text-sm text-white focus:border-[#66fcf1] focus:outline-none",
          error && "border-[#ff7a7a]",
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p role="alert" className="text-sm text-[#ff9a9a]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
