import { z } from "zod";
import type { SiteContent } from "@/lib/site-content-schema";

export type ContactValidationMessages = SiteContent["landing"]["contact"]["validationMessages"];

export function createContactSchema(messages: ContactValidationMessages) {
  return z.object({
    name: z.string().min(2, messages.nameMin).max(80, messages.nameMin),
    email: z.string().email(messages.emailInvalid).max(120, messages.emailInvalid),
    phone: z.string().min(8, messages.phoneMin).max(20, messages.phoneMin),
    service: z.string().min(2, messages.serviceRequired),
    message: z.string().min(20, messages.messageMin).max(1200, messages.messageMin),
  });
}

export type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>;
