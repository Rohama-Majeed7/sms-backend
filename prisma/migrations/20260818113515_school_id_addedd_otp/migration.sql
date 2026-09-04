/*
  Warnings:

  - A unique constraint covering the columns `[email,schoolId]` on the table `Otp` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Otp" ADD COLUMN     "schoolId" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Otp_email_schoolId_key" ON "Otp"("email", "schoolId");
