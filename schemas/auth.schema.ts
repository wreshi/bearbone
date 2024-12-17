import { z } from "zod";

export const magicLinkAuthSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .max(255),
});

export const magicLinkVerifySchema = z.object({
  token: z.string().min(1, { message: "Please enter a valid token." }),
});
