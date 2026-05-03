import { z } from "zod";

type ValidationT = (key: string) => string;

export const resetPasswordSchema = (t: ValidationT) =>
  z.object({
    email: z.string().email(t("emailInvalid")),
  });

export type TypeResetPasswordSchema = z.infer<
  ReturnType<typeof resetPasswordSchema>
>;
