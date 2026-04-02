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
      <label htmlFor={id} className="text-sm font-semibold text-[#d9dde0]">
        {label}
      </label>
      <select
        id={id}
        className={cn(
          "h-12 w-full rounded-2xl border border-[#2b3a42] bg-[#10171b] px-4 text-sm text-white focus:border-[#66fcf1] focus:outline-none",
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
