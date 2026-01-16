-- CreateTable
CREATE TABLE "CompanyRegistration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "brandName" TEXT NOT NULL,
    "activityField" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "legalAddress" TEXT NOT NULL,
    "identCode" TEXT NOT NULL,
    "directorName" TEXT NOT NULL,
    "directorId" TEXT NOT NULL,
    "gmName" TEXT NOT NULL,
    "gmEmail" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
