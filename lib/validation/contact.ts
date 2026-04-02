import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Numele trebuie să aibă cel puțin 2 caractere.")
    .max(80, "Numele este prea lung."),
  email: z
    .string()
    .email("Introdu o adresă de email validă.")
    .max(120, "Email-ul este prea lung."),
  phone: z
    .string()
    .min(8, "Numărul de telefon este prea scurt.")
    .max(20, "Numărul de telefon este prea lung."),
  service: z.string().min(2, "Selectează un serviciu de interes."),
  message: z
    .string()
    .min(20, "Mesajul trebuie să aibă cel puțin 20 de caractere.")
    .max(1200, "Mesajul este prea lung."),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
