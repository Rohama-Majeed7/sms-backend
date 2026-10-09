/*
  Warnings:

  - Changed the type of `day` on the `TimeTable` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterTable
ALTER TABLE "TimeTable" DROP COLUMN "day",
ADD COLUMN     "day" "WeekDay" NOT NULL;

-- CreateIndex
CREATE INDEX "TimeTable_sectionId_day_startTime_idx" ON "TimeTable"("sectionId", "day", "startTime");
