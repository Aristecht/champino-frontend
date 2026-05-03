import { z } from "zod";

type V = (key: string) => string;

export const emailSchema = (t: V) =>
  z.object({
    email: z.string().email(t("emailInvalid")),
  });

export type TypeEmailSchema = z.infer<ReturnType<typeof emailSchema>>;
