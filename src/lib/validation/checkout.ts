import { z } from "zod";

export const checkoutSchema = z.object({
  windowId: z.string().min(1),
  customerName: z.string().trim().min(2).max(100),
  customerPhone: z.string().trim().min(10).max(20),
  customerEmail: z.email().optional().or(z.literal("")),
  fulfillmentType: z.enum(["Delivery", "Pickup"]),
  deliveryAddress: z.string().trim().max(300).optional(),
  items: z.array(z.object({ windowProductId: z.string().min(1), quantity: z.number().int().positive().max(50) })).min(1).max(20),
}).superRefine((value, ctx) => {
  if (value.fulfillmentType === "Delivery" && !value.deliveryAddress) ctx.addIssue({ code: "custom", path: ["deliveryAddress"], message: "Enter a delivery address" });
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
