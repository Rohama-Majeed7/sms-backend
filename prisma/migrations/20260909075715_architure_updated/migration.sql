/*
  Warnings:

  - You are about to drop the column `schoolId` on the `Otp` table. All the data in the column will be lost.
  - You are about to drop the column `schoolId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `schoolName` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Otp` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- DropIndex
DROP INDEX "Otp_email_schoolId_key";

-- DropIndex
DROP INDEX "User_email_schoolId_key";

-- AlterTable
ALTER TABLE "Otp" DROP COLUMN "schoolId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "schoolId",
DROP COLUMN "schoolName";

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "Gender",
    "address" TEXT,
    "guardianName" TEXT,
    "guardianPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "employeeNumber" TEXT,
    "qualification" TEXT,
    "specialization" TEXT,
    "joiningDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_userId_key" ON "students"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_userId_key" ON "teachers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Otp_email_key" ON "Otp"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
