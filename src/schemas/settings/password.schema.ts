import { z } from "zod";

type V = (key: string) => string;

export const passwordSchema = (t: V) =>
  z.object({
    oldPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(6, t("passwordMin"))
      .regex(/[A-Z]/, t("passwordUppercase"))
      .regex(/[0-9]/, t("passwordDigit")),
  });

export type TypePasswordSchema = z.infer<ReturnType<typeof passwordSchema>>;
