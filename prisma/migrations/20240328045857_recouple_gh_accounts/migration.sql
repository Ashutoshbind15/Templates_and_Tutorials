/*
  Warnings:

  - You are about to drop the `GithubAccount` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GithubAccount" DROP CONSTRAINT "GithubAccount_userId_fkey";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "gh_app_access_token" TEXT,
ADD COLUMN     "gh_app_access_token_expires_at" TIMESTAMP(3),
ADD COLUMN     "gh_app_refresh_token" TEXT,
ADD COLUMN     "gh_app_refresh_token_expires_at" TIMESTAMP(3),
ADD COLUMN     "gh_installation_ids" TEXT[];

-- DropTable
DROP TABLE "GithubAccount";
