/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "createdAt",
ADD COLUMN     "activityField" TEXT,
ADD COLUMN     "brandName" TEXT,
ADD COLUMN     "identCode" TEXT,
ADD COLUMN     "legalAddress" TEXT,
ADD COLUMN     "logo" TEXT;
