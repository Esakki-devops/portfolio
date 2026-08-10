import { z } from "zod";

/** Shared by the form and the API route so both reject the same inputs. */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(80, "That name is too long"),
  email: z.string().trim().email("Enter a valid email address"),
  subject: z
    .string()
    .trim()
    .min(3, "Add a short subject")
    .max(120, "Please keep the subject under 120 characters"),
  message: z
    .string()
    .trim()
    .min(10, "Tell me a little more")
    .max(2000, "Please keep it under 2000 characters"),
});

export type ContactValues = z.infer<typeof contactSchema>;
