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
  type: z.enum(["PHYSICAL", "FOOD", "DIGITAL", "TICKET", "SERVICE"]).default("PHYSICAL"),
  defaultPriceNaira: z.coerce.number().positive().max(100_000_000),
  imageUrl: z.url().optional().or(z.literal("")),
  fulfillmentUrl: z.url().optional().or(z.literal("")),
  serviceDurationMinutes: z.coerce.number().int().positive().max(10_080).optional().or(z.literal("")),
  eventId: z.string().optional().or(z.literal("")),
});

const optionalDate = z.preprocess(
  (value) => value === "" || value === null ? undefined : value,
  z.coerce.date().optional(),
);

export const windowSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(500).optional(),
  headline: z.string().trim().max(140).optional(),
  mode: z.enum(["LAUNCH", "SHOP"]).default("LAUNCH"),
  opensAt: optionalDate,
  closesAt: optionalDate,
  fulfillmentAt: optionalDate,
  allowPayLater: z.boolean().default(false),
  invoiceHoldMinutes: z.coerce.number().int().min(30).max(43_200).default(120),
  invoiceReservesInventory: z.boolean().default(true),
  theme: z.enum(["CLASSIC", "HYPE"]),
  publish: z.boolean().default(false),
  products: z.array(z.object({ productId: z.string(), priceNaira: z.coerce.number().positive(), inventoryLimit: z.coerce.number().int().positive().nullable(), maxPerCustomer: z.coerce.number().int().positive().nullable() })).min(1),
}).superRefine((value, ctx) => {
  if (value.mode === "LAUNCH" && (!value.opensAt || !value.closesAt)) {
    ctx.addIssue({ code: "custom", path: ["opensAt"], message: "Launches need opening and closing times." });
  }
  if (value.opensAt && value.closesAt && value.closesAt <= value.opensAt) {
    ctx.addIssue({ code: "custom", path: ["closesAt"], message: "Closing time must be after opening time." });
  }
});
