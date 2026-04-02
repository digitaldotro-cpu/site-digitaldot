"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/form-field";
import { FormSelect } from "@/components/forms/form-select";
import { FormTextarea } from "@/components/forms/form-textarea";
import {
  contactSchema,
  type ContactFormValues,
} from "@/lib/validation/contact";

const serviceOptions = [
  { value: "", label: "Alege serviciul" },
  { value: "social-media-management", label: "Social Media Management" },
  { value: "productie-foto-video", label: "Producție Foto & Video" },
  { value: "strategie-marketing", label: "Strategie de marketing" },
  { value: "reclame-platite", label: "Reclame Plătite (Google & Facebook)" },
  { value: "audit-tracking", label: "Audit Reclame & Tracking" },
];

export function ContactForm() {
  const [serverState, setServerState] = useState<{
    type: "idle" | "success" | "error";
    message?: string;
  }>({ type: "idle" });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerState({ type: "idle" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setServerState({
          type: "error",
          message: data.message ??
            "A apărut o problemă la trimiterea formularului.",
        });
        return;
      }

      setServerState({
        type: "success",
        message: data.message ?? "Mesajul tău a fost trimis cu succes.",
      });
      reset();
    } catch {
      setServerState({
        type: "error",
        message:
          "Nu am putut trimite formularul acum. Încearcă din nou în câteva minute.",
      });
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <FormField
        id="name"
        label="Nume"
        placeholder="Numele tău"
        autoComplete="name"
        error={errors.name?.message}
        {...register("name")}
      />

      <FormField
        id="email"
        type="email"
        label="Email"
        placeholder="email@companie.ro"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <FormField
        id="phone"
        type="tel"
        label="Telefon"
        placeholder="07xx xxx xxx"
        autoComplete="tel"
        error={errors.phone?.message}
        {...register("phone")}
      />

      <FormSelect
        id="service"
        label="Serviciu de interes"
        options={serviceOptions}
        error={errors.service?.message}
        {...register("service")}
      />

      <FormTextarea
        id="message"
        label="Mesaj"
        placeholder="Spune-ne pe scurt care este obiectivul principal și ce ai testat până acum."
        error={errors.message?.message}
        {...register("message")}
      />

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Trimitem..." : "Trimite mesajul"}
      </Button>

      {serverState.type !== "idle" ? (
        <p
          className={
            serverState.type === "success"
              ? "rounded-2xl border border-[#2a4846] bg-[#11302f] px-4 py-3 text-sm text-[#9bf7f1]"
              : "rounded-2xl border border-[#4a2e2e] bg-[#321b1b] px-4 py-3 text-sm text-[#ffb6b6]"
          }
          role="status"
        >
          {serverState.message}
        </p>
      ) : null}
    </form>
  );
}
