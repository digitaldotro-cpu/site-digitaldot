"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/form-field";
import { FormSelect } from "@/components/forms/form-select";
import { FormTextarea } from "@/components/forms/form-textarea";
import { createContactSchema, type ContactFormValues } from "@/lib/validation/contact";
import type { SiteContent } from "@/lib/site-content-schema";

type ContactFormConfig = SiteContent["landing"]["contact"];

type ContactFormProps = {
  config: ContactFormConfig;
};

export function ContactForm({ config }: ContactFormProps) {
  const [serverState, setServerState] = useState<{
    type: "idle" | "success" | "error";
    message?: string;
  }>({ type: "idle" });

  const contactSchema = useMemo(
    () => createContactSchema(config.validationMessages),
    [config.validationMessages],
  );

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

  const selectOptions = [
    { value: "", label: config.fields.service.placeholder },
    ...config.serviceOptions,
  ];

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
          message: data.message ?? config.errorMessage,
        });
        return;
      }

      setServerState({
        type: "success",
        message: data.message ?? config.successMessage,
      });
      reset();
    } catch {
      setServerState({
        type: "error",
        message: config.errorMessage,
      });
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <FormField
        id="name"
        label={config.fields.name.label}
        placeholder={config.fields.name.placeholder}
        autoComplete="name"
        error={errors.name?.message}
        {...register("name")}
      />

      <FormField
        id="email"
        type="email"
        label={config.fields.email.label}
        placeholder={config.fields.email.placeholder}
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <FormField
        id="phone"
        type="tel"
        label={config.fields.phone.label}
        placeholder={config.fields.phone.placeholder}
        autoComplete="tel"
        error={errors.phone?.message}
        {...register("phone")}
      />

      <FormSelect
        id="service"
        label={config.fields.service.label}
        options={selectOptions}
        error={errors.service?.message}
        {...register("service")}
      />

      <FormTextarea
        id="message"
        label={config.fields.message.label}
        placeholder={config.fields.message.placeholder}
        error={errors.message?.message}
        {...register("message")}
      />

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? config.buttonLoadingText : config.buttonText}
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
