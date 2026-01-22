import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("4000"),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  INVITE_EXPIRY_HOURS: z.string().transform((value: string) => Number(value)),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error("Invalid environment variables", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration");
}

const env = {
  port: Number(parsed.data.PORT),
  databaseUrl: parsed.data.DATABASE_URL,
  jwtSecret: parsed.data.JWT_SECRET,
  inviteExpiryHours: parsed.data.INVITE_EXPIRY_HOURS,
};

if (Number.isNaN(env.inviteExpiryHours)) {
  throw new Error("INVITE_EXPIRY_HOURS must be a number");
}

export { env };
