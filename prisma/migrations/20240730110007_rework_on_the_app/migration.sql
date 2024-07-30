/*
  Warnings:

  - You are about to drop the column `gh_app_access_token` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `gh_app_access_token_expires_at` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `gh_app_refresh_token` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `gh_app_refresh_token_expires_at` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `cost` on the `Repo` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Repo` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RequestRepo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_StudentRepo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "_RequestRepo" DROP CONSTRAINT "_RequestRepo_A_fkey";

-- DropForeignKey
ALTER TABLE "_RequestRepo" DROP CONSTRAINT "_RequestRepo_B_fkey";

-- DropForeignKey
ALTER TABLE "_StudentRepo" DROP CONSTRAINT "_StudentRepo_A_fkey";

-- DropForeignKey
ALTER TABLE "_StudentRepo" DROP CONSTRAINT "_StudentRepo_B_fkey";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "gh_app_access_token",
DROP COLUMN "gh_app_access_token_expires_at",
DROP COLUMN "gh_app_refresh_token",
DROP COLUMN "gh_app_refresh_token_expires_at";

-- AlterTable
ALTER TABLE "Repo" DROP COLUMN "cost",
DROP COLUMN "description";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "_RequestRepo";

-- DropTable
DROP TABLE "_StudentRepo";

-- CreateTable
CREATE TABLE "RepoMetadata" (
    "id" TEXT NOT NULL,
    "repoId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "videoUrl" TEXT,
    "cost" INTEGER NOT NULL DEFAULT 10000,

    CONSTRAINT "RepoMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "repoId" TEXT NOT NULL,

    CONSTRAINT "section_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RepoMetadata_repoId_key" ON "RepoMetadata"("repoId");

-- AddForeignKey
ALTER TABLE "RepoMetadata" ADD CONSTRAINT "RepoMetadata_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section" ADD CONSTRAINT "section_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "RepoMetadata"("repoId") ON DELETE CASCADE ON UPDATE CASCADE;
