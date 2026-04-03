"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export type ToastItem = {
  id: string;
  type: "success" | "error" | "info";
  message: string;
};

type ToastStackProps = {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
};

const iconByType = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const styleByType = {
  success: "border-[#01504c]/60 bg-[#1e2020] text-[#62f9ee]",
  error: "border-[#93000a]/40 bg-[#1e2020] text-[#ffb4ab]",
  info: "border-[#3c4948]/60 bg-[#1e2020] text-[#bacac7]",
};

export function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[130] flex w-full max-w-sm flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = iconByType[toast.type];

          return (
            <motion.button
              key={toast.id}
              type="button"
              onClick={() => onDismiss(toast.id)}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              className={`pointer-events-auto flex items-start gap-2 rounded-xl border px-3 py-2 text-left text-sm ${styleByType[toast.type]}`}
            >
              <Icon className="mt-0.5 h-4 w-4" />
              <span>{toast.message}</span>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
