import { z } from "zod";

export const onboardingSchema = z.object({
  name: z.string().trim().min(2).max(100),
  category: z.string().trim().min(2).max(80),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  phone: z.string().trim().min(10).max(20),
  whatsapp: z.string().trim().min(10).max(20).optional(),
  contactEmail: z.email().optional().or(z.literal("")),
  bankName: z.string().trim().min(2).max(100),
  accountNumber: z.string().trim().regex(/^\d{10}$/, "Enter a 10-digit account number."),
  accountName: z.string().trim().min(2).max(120),
});

export const productSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(5).max(500),
  defaultPriceNaira: z.coerce.number().positive().max(100_000_000),
  imageUrl: z.url().optional().or(z.literal("")),
});

export const windowSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(500).optional(),
  headline: z.string().trim().max(140).optional(),
  opensAt: z.coerce.date(),
  closesAt: z.coerce.date(),
  fulfillmentAt: z.coerce.date().optional(),
  theme: z.enum(["CLASSIC", "HYPE"]),
  publish: z.boolean().default(false),
  products: z.array(z.object({ productId: z.string(), priceNaira: z.coerce.number().positive(), inventoryLimit: z.coerce.number().int().positive().nullable(), maxPerCustomer: z.coerce.number().int().positive().nullable() })).min(1),
}).refine((value) => value.closesAt > value.opensAt, { path: ["closesAt"], message: "Closing time must be after opening time." });
