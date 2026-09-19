-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('PHYSICAL', 'FOOD', 'DIGITAL', 'TICKET', 'SERVICE');

-- CreateEnum
CREATE TYPE "SellingMode" AS ENUM ('LAUNCH', 'SHOP');

-- CreateEnum
CREATE TYPE "LocationVisibility" AS ENUM ('PUBLIC', 'GENERAL_AREA', 'AFTER_PAYMENT');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('UNPAID', 'PAID', 'EXPIRED', 'VOID');

-- CreateEnum
CREATE TYPE "CopywritingRequestStatus" AS ENUM ('REQUESTED', 'IN_REVIEW', 'DELIVERED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "fulfillmentUrl" TEXT,
ADD COLUMN     "serviceDurationMinutes" INTEGER,
ADD COLUMN     "type" "ProductType" NOT NULL DEFAULT 'PHYSICAL';

-- AlterTable
ALTER TABLE "SellingWindow" ADD COLUMN     "allowPayLater" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "invoiceHoldMinutes" INTEGER NOT NULL DEFAULT 120,
ADD COLUMN     "invoiceReservesInventory" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "mode" "SellingMode" NOT NULL DEFAULT 'LAUNCH',
ALTER COLUMN "opensAt" DROP NOT NULL,
ALTER COLUMN "closesAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "VendorProfile" ADD COLUMN     "fulfillmentInstructions" TEXT,
ADD COLUMN     "locationVisibility" "LocationVisibility" NOT NULL DEFAULT 'GENERAL_AREA',
ADD COLUMN     "publicLocation" TEXT;

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "publicToken" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "customerUserId" TEXT,
    "amountKobo" INTEGER NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'UNPAID',
    "dueAt" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "orderId" TEXT,
    "windowId" TEXT,
    "productId" TEXT,
    "invoiceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationParticipant" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastReadAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageAttachment" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CopywritingRequest" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "windowId" TEXT,
    "audience" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "notes" TEXT,
    "status" "CopywritingRequestStatus" NOT NULL DEFAULT 'REQUESTED',
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "deliverables" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CopywritingRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_publicToken_key" ON "Invoice"("publicToken");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_orderId_key" ON "Invoice"("orderId");

-- CreateIndex
CREATE INDEX "Invoice_vendorId_status_idx" ON "Invoice"("vendorId", "status");

-- CreateIndex
CREATE INDEX "Invoice_customerUserId_status_idx" ON "Invoice"("customerUserId", "status");

-- CreateIndex
CREATE INDEX "Conversation_vendorId_updatedAt_idx" ON "Conversation"("vendorId", "updatedAt");

-- CreateIndex
CREATE INDEX "Conversation_orderId_idx" ON "Conversation"("orderId");

-- CreateIndex
CREATE INDEX "Conversation_windowId_idx" ON "Conversation"("windowId");

-- CreateIndex
CREATE INDEX "Conversation_productId_idx" ON "Conversation"("productId");

-- CreateIndex
CREATE INDEX "Conversation_invoiceId_idx" ON "Conversation"("invoiceId");

-- CreateIndex
CREATE INDEX "ConversationParticipant_userId_idx" ON "ConversationParticipant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationParticipant_conversationId_userId_key" ON "ConversationParticipant"("conversationId", "userId");

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "MessageAttachment_messageId_idx" ON "MessageAttachment"("messageId");

-- CreateIndex
CREATE INDEX "CopywritingRequest_vendorId_status_idx" ON "CopywritingRequest"("vendorId", "status");

-- CreateIndex
CREATE INDEX "CopywritingRequest_windowId_idx" ON "CopywritingRequest"("windowId");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "VendorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerUserId_fkey" FOREIGN KEY ("customerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "VendorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_windowId_fkey" FOREIGN KEY ("windowId") REFERENCES "SellingWindow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageAttachment" ADD CONSTRAINT "MessageAttachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CopywritingRequest" ADD CONSTRAINT "CopywritingRequest_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "VendorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CopywritingRequest" ADD CONSTRAINT "CopywritingRequest_windowId_fkey" FOREIGN KEY ("windowId") REFERENCES "SellingWindow"("id") ON DELETE SET NULL ON UPDATE CASCADE;
