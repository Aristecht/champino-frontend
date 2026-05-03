import { z } from "zod";

type ValidationT = (key: string) => string;

export const createAccountSchema = (t: ValidationT) =>
  z.object({
    username: z
      .string()
      .min(3, t("usernameMin"))
      .max(32, t("usernameMax"))
      .regex(/^[a-zA-Z0-9_]+$/, t("usernamePattern")),
    email: z.string().email(t("emailInvalid")),
    password: z
      .string()
      .min(6, t("passwordMin"))
      .regex(/[A-Z]/, t("passwordUppercase"))
      .regex(/[0-9]/, t("passwordDigit")),
  });

export type TypeCreateAccountSchema = z.infer<
  ReturnType<typeof createAccountSchema>
>;
