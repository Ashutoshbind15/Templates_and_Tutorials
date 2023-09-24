-- CreateTable
CREATE TABLE "_RequestRepo" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RequestRepo_AB_unique" ON "_RequestRepo"("A", "B");

-- CreateIndex
CREATE INDEX "_RequestRepo_B_index" ON "_RequestRepo"("B");

-- AddForeignKey
ALTER TABLE "_RequestRepo" ADD CONSTRAINT "_RequestRepo_A_fkey" FOREIGN KEY ("A") REFERENCES "Repo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RequestRepo" ADD CONSTRAINT "_RequestRepo_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
