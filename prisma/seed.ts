import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { randomBytes } from "node:crypto";

const prisma = new PrismaClient();

async function main() {
  await prisma.payment.deleteMany();
  await prisma.webhookEvent.deleteMany();
  await prisma.settlement.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.windowProduct.deleteMany();
  await prisma.sellingWindow.deleteMany();
  await prisma.product.deleteMany();
  await prisma.vendorMember.deleteMany();
  await prisma.vendorProfile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.emailVerificationToken.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.user.deleteMany();

  const demoPassword = await hash("hemigo-demo", 12);
  const user = await prisma.user.create({ data: { email: "amaka@hemigo.demo", name: "Amaka Okafor", passwordHash: demoPassword, emailVerifiedAt: new Date() } });
  const vendor = await prisma.vendorProfile.create({ data: { ownerId: user.id, name: "Amaka's Kitchen", slug: "amaka-kitchen", category: "Food & catering", phone: "08032145670", whatsapp: "08032145670", contactEmail: "amaka@hemigo.demo", location: "Lekki, Lagos", onboardingCompleted: true, bankName: "Guaranty Trust Bank", accountNumber: "0123456789", accountName: "AMAKA OKAFOR" } });
  await prisma.vendorMember.create({ data: { userId: user.id, vendorId: vendor.id, role: "OWNER" } });
  const productData = [
    ["Smoky Jollof + Chicken", "smoky-jollof-chicken", "Smoky party jollof served with juicy grilled chicken and slaw.", 550000],
    ["Fried Rice + Turkey", "fried-rice-turkey", "Colourful fried rice with peppered turkey and sweet plantain.", 650000],
    ["Sweet Fried Plantain", "sweet-fried-plantain", "A generous side of caramelised ripe plantain.", 150000],
    ["House Chapman", "house-chapman", "A bright, cold house blend with citrus and cucumber.", 200000],
  ] as const;
  const products = await Promise.all(productData.map(([name, slug, description, defaultPrice]) => prisma.product.create({ data: { vendorId: vendor.id, name, slug, description, defaultPrice } })));
  const now = Date.now();
  const window = await prisma.sellingWindow.create({ data: { vendorId: vendor.id, name: "Sunday Lunch Batch", slug: "sunday-lunch", description: "A proper Sunday spread, freshly made.", headline: "Sunday tastes better here.", opensAt: new Date(now - 86_400_000), closesAt: new Date(now + 86_400_000), fulfillmentAt: new Date(now + 172_800_000), status: "LIVE" } });
  const windowProducts = await Promise.all(products.map((product, index) => prisma.windowProduct.create({ data: { windowId: window.id, productId: product.id, priceKobo: product.defaultPrice, inventoryLimit: [50, 36, 45, 30][index], soldQty: [42, 28, 34, 21][index], maxPerCustomer: 5 } })));

  const names = ["Tolu Ajayi", "Chioma Okafor", "Damilola Ojo", "Ifeanyi Nwosu", "Zainab Bello", "Kemi Adeyemi", "Seun Balogun", "Amina Musa"];
  for (let index = 0; index < 20; index++) {
    const product = windowProducts[index % windowProducts.length];
    const price = products[index % products.length].defaultPrice;
    await prisma.order.create({ data: { orderNumber: `HMG-${1023-index}`, publicToken: randomBytes(18).toString("base64url"), vendorId: vendor.id, windowId: window.id, customerName: names[index % names.length], customerPhone: `08032145${String(67 + index).padStart(2,"0")}`, fulfillmentType: index % 3 ? "Delivery" : "Pickup", subtotalKobo: price, totalKobo: price, status: "PAID", paidAt: new Date(now - index * 3_600_000), fulfillmentStatus: index % 4 === 2 ? "FULFILLED" : "PENDING", items: { create: { windowProductId: product.id, productName: products[index % products.length].name, unitPriceKobo: price, quantity: 1, lineTotalKobo: price } } } });
  }

  const noirOwner = await prisma.user.create({ data: { email: "noir@hemigo.demo", name: "NOIR Lagos", passwordHash: demoPassword, emailVerifiedAt: new Date() } });
  const noir = await prisma.vendorProfile.create({ data: { ownerId: noirOwner.id, name: "NOIR Lagos", slug: "noir-lagos", category: "Fashion & thrift", phone: "08000000000", location: "Lagos", onboardingCompleted: true } });
  await prisma.vendorMember.create({ data: { userId: noirOwner.id, vendorId: noir.id, role: "OWNER" } });
  const noirProducts = await Promise.all([["Vintage Racing Tee","vintage-racing-tee",1850000],["Utility Cargo","utility-cargo",2800000],["Archive Denim","archive-denim",3200000]].map(([name,slug,defaultPrice])=>prisma.product.create({data:{vendorId:noir.id,name:String(name),slug:String(slug),description:"A hand-picked archive piece. Once it is claimed, it is gone.",defaultPrice:Number(defaultPrice)}})));
  const drop = await prisma.sellingWindow.create({ data: { vendorId: noir.id, name: "September Release", slug: "september-drop", headline: "Old pieces. New energy.", opensAt: new Date(now - 86_400_000), closesAt: new Date(now + 172_800_000), status: "LIVE", theme: "HYPE" } });
  await Promise.all(noirProducts.map((product,index)=>prisma.windowProduct.create({data:{windowId:drop.id,productId:product.id,priceKobo:product.defaultPrice,inventoryLimit:[8,6,10][index],soldQty:[5,2,7][index],maxPerCustomer:2}})));
  await prisma.settlement.create({ data: { vendorId: vendor.id, providerReference: "demo_settlement_001", grossKobo: 48250000, platformFeeKobo: 1930000, netKobo: 46320000, status: "PAID", settledAt: new Date(now - 2 * 86_400_000) } });
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(async () => prisma.$disconnect());
