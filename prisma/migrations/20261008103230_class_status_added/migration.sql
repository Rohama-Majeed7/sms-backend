-- CreateEnum
CREATE TYPE "ClassStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "status" "ClassStatus" NOT NULL DEFAULT 'DRAFT';
