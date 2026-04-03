"use client";

import { cn } from "@/lib/utils";

export function PanelTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.64rem] font-bold uppercase tracking-[0.2em] text-[#bacac7]">{children}</p>;
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#bacac7]">{children}</label>;
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-[#3c4948]/40 bg-[#0d0e0f] px-4 text-sm text-white placeholder:text-[#617783] focus:border-[#62f9ee] focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-[120px] w-full rounded-xl border border-[#3c4948]/40 bg-[#0d0e0f] px-4 py-3 text-sm text-white placeholder:text-[#617783] focus:border-[#62f9ee] focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-xl border border-[#3c4948]/40 bg-[#0d0e0f] px-4 text-sm text-white focus:border-[#62f9ee] focus:outline-none",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-xs text-[#f3a6ae]">{message}</p>;
}
