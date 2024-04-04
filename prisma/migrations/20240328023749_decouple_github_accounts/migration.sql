/*
  Warnings:

  - You are about to drop the column `installationIds` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "installationIds";

-- CreateTable
CREATE TABLE "GithubAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshToken" TEXT,
    "accessToken" TEXT,
    "refreshTokenExpires" TIMESTAMP(3),
    "accessTokenExpires" TIMESTAMP(3),
    "installationIds" TEXT[],

    CONSTRAINT "GithubAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GithubAccount_userId_key" ON "GithubAccount"("userId");

-- AddForeignKey
ALTER TABLE "GithubAccount" ADD CONSTRAINT "GithubAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
