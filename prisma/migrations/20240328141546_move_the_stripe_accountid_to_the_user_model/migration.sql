/*
  Warnings:

  - You are about to drop the column `ownerStripeAccountId` on the `StripeProduct` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StripeProduct" DROP COLUMN "ownerStripeAccountId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stripeAccountId" TEXT;
