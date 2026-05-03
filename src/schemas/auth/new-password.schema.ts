import { z } from "zod";

type ValidationT = (key: string) => string;

export const newPasswordSchema = (t: ValidationT) =>
  z
    .object({
      password: z.string().min(6, t("passwordVal")),
      passwordRepeat: z.string().min(6, t("passwordRepeatVal")),
    })
    .refine((data) => data.password === data.passwordRepeat, {
      message: t("passwordMismatch"),
      path: ["passwordRepeat"],
    });

export type TypeNewPasswordSchema = z.infer<
  ReturnType<typeof newPasswordSchema>
>;
