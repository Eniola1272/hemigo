import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const base = process.env.E2E_BASE_URL || "http://127.0.0.1:3100";
const productIds = [];
const windowIds = [];
const orderIds = [];
const paymentReferences = [];
let eventId;
let vendorId;
let subscriptionBefore;
let conversationId;
let copywritingRequestId;
let contactInquiryId;

async function request(path, options = {}) {
  const response = await fetch(base + path, options);
  const text = await response.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  return { response, body };
}

try {
  const login = await request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "amaka@hemigo.demo", password: "hemigo-demo" }),
  });
  assert.equal(login.response.status, 200);
  const cookie = login.response.headers.get("set-cookie")?.split(";")[0];
  assert.ok(cookie, "Login must set a session cookie");
  const authHeaders = { "Content-Type": "application/json", Cookie: cookie, Origin: base };
  const marker = Date.now().toString();

  assert.equal((await fetch(base + "/about")).status, 200);
  assert.equal((await fetch(base + "/contact")).status, 200);
  assert.equal((await fetch(base + "/robots.txt")).status, 200);
  assert.equal((await fetch(base + "/sitemap.xml")).status, 200);
  assert.equal((await fetch(base + "/manifest.webmanifest")).status, 200);
  const contact = await request("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: base },
    body: JSON.stringify({
      name: "SEO Smoke Test",
      email: `contact-${marker}@example.com`,
      topic: "General enquiry",
      subject: "Contact workflow smoke test",
      message: "This message verifies the persisted Hemigo contact workflow.",
      website: "",
    }),
  });
  assert.equal(contact.response.status, 201);
  contactInquiryId = (await db.contactInquiry.findFirstOrThrow({
    where: { email: `contact-${marker}@example.com` },
  })).id;

  const createdProduct = await request("/api/dashboard/products", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ name: `E2E Product ${marker}`, description: "Created by the production smoke test", type: "DIGITAL", defaultPriceNaira: 2500, imageUrl: "", fulfillmentUrl: "https://example.com/e2e-download", serviceDurationMinutes: "" }),
  });
  assert.equal(createdProduct.response.status, 201);
  const productId = createdProduct.body.product.id;
  productIds.push(productId);
  vendorId = createdProduct.body.product.vendorId;
  subscriptionBefore = await db.vendorSubscription.findUnique({ where: { vendorId } });

  const createdWindow = await request("/api/dashboard/windows", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ name: `E2E Window ${marker}`, description: "End-to-end test window", headline: "A real test window", mode: "LAUNCH", opensAt: new Date(Date.now() - 60_000).toISOString(), closesAt: new Date(Date.now() + 3_600_000).toISOString(), allowPayLater: true, invoiceHoldMinutes: 30, invoiceReservesInventory: false, theme: "CLASSIC", publish: true, products: [{ productId, priceNaira: 2500, inventoryLimit: 2, maxPerCustomer: 1 }] }),
  });
  assert.equal(createdWindow.response.status, 201);
  const windowId = createdWindow.body.window.id;
  windowIds.push(windowId);
  assert.equal((await fetch(base + createdWindow.body.shareUrl)).status, 200);
  assert.equal((await fetch(base + "/explore")).status, 200);
  const windowProduct = await db.windowProduct.findFirstOrThrow({ where: { windowId, productId } });

  const reserved = await request("/api/checkout/reserve", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ windowId, customerName: "E2E Customer", customerPhone: "08099999999", customerEmail: "e2e@example.com", fulfillmentType: "Digital", paymentMethod: "PAY_NOW", items: [{ windowProductId: windowProduct.id, quantity: 1 }] }),
  });
  assert.equal(reserved.response.status, 201);
  orderIds.push(reserved.body.orderId);
  const initialized = await request("/api/payments/initialize", { method: "POST", headers: authHeaders, body: JSON.stringify({ orderId: reserved.body.orderId }) });
  assert.equal(initialized.response.status, 200);
  paymentReferences.push(initialized.body.reference);
  assert.match(initialized.body.authorization_url, /^\/order\//);
  assert.equal((await fetch(base + initialized.body.authorization_url)).status, 200);
  assert.equal((await db.order.findUniqueOrThrow({ where: { id: reserved.body.orderId } })).status, "PAID");
  assert.equal((await fetch(base + `/receipt/${reserved.body.publicToken}`)).status, 200);

  const invoiced = await request("/api/checkout/reserve", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ windowId, customerName: "Invoice Customer", customerPhone: "08088888888", customerEmail: "invoice@example.com", fulfillmentType: "Digital", paymentMethod: "PAY_LATER", items: [{ windowProductId: windowProduct.id, quantity: 1 }] }),
  });
  assert.equal(invoiced.response.status, 201);
  assert.match(invoiced.body.invoiceUrl, /^\/invoice\//);
  orderIds.push(invoiced.body.orderId);
  assert.equal((await fetch(base + invoiced.body.invoiceUrl)).status, 200);
  assert.equal((await db.order.findUniqueOrThrow({ where: { id: invoiced.body.orderId } })).inventoryReserved, false);
  assert.equal((await db.windowProduct.findUniqueOrThrow({ where: { id: windowProduct.id } })).reservedQty, 0);
  const invoicePayment = await request("/api/payments/initialize", { method: "POST", headers: authHeaders, body: JSON.stringify({ orderId: invoiced.body.orderId }) });
  assert.equal(invoicePayment.response.status, 200);
  paymentReferences.push(invoicePayment.body.reference);
  assert.equal((await fetch(base + invoicePayment.body.authorization_url)).status, 200);
  assert.equal((await db.invoice.findUniqueOrThrow({ where: { orderId: invoiced.body.orderId } })).status, "PAID");

  const shop = await request("/api/dashboard/windows", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ name: `E2E Shop ${marker}`, description: "Always-open test shop", headline: "Always available", mode: "SHOP", allowPayLater: false, invoiceHoldMinutes: 120, invoiceReservesInventory: true, theme: "CLASSIC", publish: true, products: [{ productId, priceNaira: 2500, inventoryLimit: 5, maxPerCustomer: 1 }] }),
  });
  assert.equal(shop.response.status, 201);
  windowIds.push(shop.body.window.id);
  assert.equal((await fetch(base + shop.body.shareUrl)).status, 200);

  const conversation = await request("/api/conversations", { method: "POST", headers: authHeaders, body: JSON.stringify({ vendorId, windowId, subject: "E2E enquiry", body: "Is this still available?" }) });
  assert.equal(conversation.response.status, 201);
  conversationId = conversation.body.conversationId;
  assert.equal((await fetch(base + `/messages/${conversationId}`, { headers: { Cookie: cookie } })).status, 200);

  const copywriting = await request("/api/dashboard/copywriting", { method: "POST", headers: authHeaders, body: JSON.stringify({ windowId, audience: "E2E customers", tone: "Warm and trustworthy", notes: "Smoke test" }) });
  assert.equal(copywriting.response.status, 201);
  copywritingRequestId = copywriting.body.request.id;
  assert.equal((await fetch(base + "/purchases", { headers: { Cookie: cookie } })).status, 200);

  const createdEvent = await request("/api/dashboard/events", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      name: `E2E Event ${marker}`,
      startsAt: new Date(Date.now() + 7 * 86_400_000).toISOString(),
      venue: "Hemigo E2E Hall",
      capacity: 2,
    }),
  });
  assert.equal(createdEvent.response.status, 201);
  eventId = createdEvent.body.event.id;

  const ticketProduct = await request("/api/dashboard/products", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      name: `E2E Ticket ${marker}`,
      description: "A real ticket issued by the production smoke test",
      type: "TICKET",
      eventId,
      defaultPriceNaira: 3500,
      imageUrl: "",
      fulfillmentUrl: "",
      serviceDurationMinutes: "",
    }),
  });
  assert.equal(ticketProduct.response.status, 201);
  const ticketProductId = ticketProduct.body.product.id;
  productIds.push(ticketProductId);

  const ticketWindow = await request("/api/dashboard/windows", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      name: `E2E Tickets ${marker}`,
      description: "Ticket issuance test",
      headline: "Admit one",
      mode: "LAUNCH",
      opensAt: new Date(Date.now() - 60_000).toISOString(),
      closesAt: new Date(Date.now() + 3_600_000).toISOString(),
      allowPayLater: false,
      invoiceHoldMinutes: 120,
      invoiceReservesInventory: true,
      theme: "CLASSIC",
      publish: true,
      products: [{
        productId: ticketProductId,
        priceNaira: 3500,
        inventoryLimit: 2,
        maxPerCustomer: 2,
      }],
    }),
  });
  assert.equal(ticketWindow.response.status, 201);
  const ticketWindowId = ticketWindow.body.window.id;
  windowIds.push(ticketWindowId);
  const ticketWindowProduct = await db.windowProduct.findFirstOrThrow({
    where: { windowId: ticketWindowId, productId: ticketProductId },
  });

  const ticketReservation = await request("/api/checkout/reserve", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      windowId: ticketWindowId,
      customerName: "Ticket Holder",
      customerPhone: "08077777777",
      customerEmail: "ticket@example.com",
      fulfillmentType: "Digital",
      paymentMethod: "PAY_NOW",
      items: [{ windowProductId: ticketWindowProduct.id, quantity: 1 }],
    }),
  });
  assert.equal(ticketReservation.response.status, 201);
  orderIds.push(ticketReservation.body.orderId);
  const ticketPayment = await request("/api/payments/initialize", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ orderId: ticketReservation.body.orderId }),
  });
  assert.equal(ticketPayment.response.status, 200);
  paymentReferences.push(ticketPayment.body.reference);
  const issuedTicket = await db.ticket.findFirstOrThrow({
    where: { orderItem: { orderId: ticketReservation.body.orderId } },
  });
  assert.equal((await fetch(base + `/ticket/${issuedTicket.publicToken}`)).status, 200);

  const checkedIn = await request(`/api/dashboard/events/${eventId}/check-in`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ value: issuedTicket.publicToken }),
  });
  assert.equal(checkedIn.response.status, 200);
  const duplicateCheckIn = await request(`/api/dashboard/events/${eventId}/check-in`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ value: issuedTicket.publicToken }),
  });
  assert.equal(duplicateCheckIn.response.status, 409);

  const subscription = await request("/api/dashboard/billing/subscribe", {
    method: "POST",
    headers: authHeaders,
  });
  assert.equal(subscription.response.status, 200);
  assert.equal(
    (await db.vendorSubscription.findUniqueOrThrow({ where: { vendorId } })).status,
    "ACTIVE",
  );
  assert.equal((await fetch(base + "/dashboard/billing", { headers: { Cookie: cookie } })).status, 200);

  console.log("E2E PASS: auth → product types → launch/shop → pay now/invoice → receipts → messages → copywriting → tickets/check-in → subscriptions");
} finally {
  if (contactInquiryId) await db.contactInquiry.deleteMany({ where: { id: contactInquiryId } });
  if (copywritingRequestId) await db.copywritingRequest.deleteMany({ where: { id: copywritingRequestId } });
  if (conversationId) await db.conversation.deleteMany({ where: { id: conversationId } });
  if (paymentReferences.length) await db.settlement.deleteMany({ where: { providerReference: { in: paymentReferences } } });
  if (orderIds.length) await db.order.deleteMany({ where: { id: { in: orderIds } } });
  if (windowIds.length) await db.sellingWindow.deleteMany({ where: { id: { in: windowIds } } });
  if (productIds.length) await db.product.deleteMany({ where: { id: { in: productIds } } });
  if (eventId) await db.event.deleteMany({ where: { id: eventId } });
  if (vendorId) {
    if (subscriptionBefore) {
      await db.vendorSubscription.update({
        where: { vendorId },
        data: {
          status: subscriptionBefore.status,
          amountKobo: subscriptionBefore.amountKobo,
          trialEndsAt: subscriptionBefore.trialEndsAt,
          currentPeriodEnd: subscriptionBefore.currentPeriodEnd,
          providerSubscriptionCode: subscriptionBefore.providerSubscriptionCode,
          providerEmailToken: subscriptionBefore.providerEmailToken,
          pendingReference: subscriptionBefore.pendingReference,
        },
      });
    } else {
      await db.vendorSubscription.deleteMany({ where: { vendorId } });
    }
  }
  await db.$disconnect();
}
