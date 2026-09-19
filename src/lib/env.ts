const REQUIRED_PRODUCTION_ENV = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "CRON_SECRET",
  "NEXT_PUBLIC_APP_URL",
  "PAYSTACK_SECRET_KEY",
  "EMAIL_PROVIDER_API_KEY",
  "EMAIL_FROM",
] as const;

export function productionConfigIssues() {
  if (process.env.NODE_ENV !== "production") return [];
  const issues: string[] = [];
  for (const name of REQUIRED_PRODUCTION_ENV) {
    if (!process.env[name]?.trim()) issues.push(`${name} is missing`);
  }
  if ((process.env.AUTH_SECRET?.length ?? 0) < 32) {
    issues.push("AUTH_SECRET must contain at least 32 characters");
  }
  try {
    const appUrl = new URL(process.env.NEXT_PUBLIC_APP_URL ?? "");
    if (appUrl.protocol !== "https:") {
      issues.push("NEXT_PUBLIC_APP_URL must use HTTPS");
    }
  } catch {
    issues.push("NEXT_PUBLIC_APP_URL must be an absolute URL");
  }
  const fee = Number(process.env.PLATFORM_FEE_PERCENT ?? "4");
  if (!Number.isFinite(fee) || fee < 0 || fee > 100) {
    issues.push("PLATFORM_FEE_PERCENT must be between 0 and 100");
  }
  return Array.from(new Set(issues));
}
