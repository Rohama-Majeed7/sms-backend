/*
  Warnings:

  - A unique constraint covering the columns `[schoolId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "schoolId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_schoolId_key" ON "User"("schoolId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;
