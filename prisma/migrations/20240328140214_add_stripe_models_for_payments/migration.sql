-- AlterTable
ALTER TABLE "Repo" ADD COLUMN     "hasStripeProduct" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "StripeProduct" (
    "id" TEXT NOT NULL,
    "repoId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "priceId" TEXT NOT NULL,
    "description" TEXT,
    "ownerStripeAccountId" TEXT,
    "features" TEXT[],

    CONSTRAINT "StripeProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeProductId" TEXT NOT NULL,
    "stripePriceId" TEXT NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BuyRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StripeProduct_repoId_key" ON "StripeProduct"("repoId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeProduct_productId_key" ON "StripeProduct"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeProduct_priceId_key" ON "StripeProduct"("priceId");

-- CreateIndex
CREATE UNIQUE INDEX "BuyRequest_stripeProductId_key" ON "BuyRequest"("stripeProductId");

-- AddForeignKey
ALTER TABLE "StripeProduct" ADD CONSTRAINT "StripeProduct_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyRequest" ADD CONSTRAINT "BuyRequest_stripeProductId_fkey" FOREIGN KEY ("stripeProductId") REFERENCES "StripeProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
