/*
  Warnings:

  - You are about to drop the column `installationId` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "installationId",
ADD COLUMN     "installationIds" TEXT[];
