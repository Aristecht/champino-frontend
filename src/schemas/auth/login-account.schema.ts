import { z } from "zod";

type ValidationT = (key: string) => string;

export const loginAccountSchema = (t: ValidationT) =>
  z.object({
    login: z.string().min(3, t("loginMin")),
    password: z.string().min(6, t("passwordMin")),
    pin: z.string().optional(),
  });

export type TypeLoginAccountSchema = z.infer<
  ReturnType<typeof loginAccountSchema>
>;
