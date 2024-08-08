-- AlterTable
ALTER TABLE "RepoMetadata" ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "section" ADD COLUMN     "sectionNotesUrl" TEXT;

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "review" TEXT,
    "userId" TEXT NOT NULL,
    "repoMetadataId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_repoMetadataId_fkey" FOREIGN KEY ("repoMetadataId") REFERENCES "RepoMetadata"("id") ON DELETE CASCADE ON UPDATE CASCADE;
