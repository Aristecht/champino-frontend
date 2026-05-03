import { z } from "zod";

type V = (key: string) => string;

export const profileSchema = (t: V) =>
  z.object({
    displayName: z
      .string()
      .min(2, t("displayNameMin"))
      .max(64, t("displayNameMax")),
    username: z
      .string()
      .min(3, t("usernameMin"))
      .max(32, t("usernameMax"))
      .regex(/^[a-zA-Z0-9_]+$/, t("usernamePattern")),
    bio: z.string().max(300, t("bioMax")),
  });

export type TypeProfileSchema = z.infer<ReturnType<typeof profileSchema>>;
