-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "personalId" TEXT,
    "citizenship" TEXT NOT NULL DEFAULT 'GE',
    "passportNumber" TEXT,
    "address" TEXT,
    "photo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "joinedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCorporate" BOOLEAN NOT NULL DEFAULT false,
    "companyName" TEXT,
    "groupId" TEXT,
    "groupType" TEXT,
    "guardianFirstName" TEXT,
    "guardianLastName" TEXT,
    "guardianPersonalId" TEXT,
    "guardianPhone" TEXT,
    "accessMobile" BOOLEAN NOT NULL DEFAULT false,
    "accessBracelet" BOOLEAN NOT NULL DEFAULT false,
    "accessCard" BOOLEAN NOT NULL DEFAULT false,
    "braceletCode" TEXT,
    "cardCode" TEXT,
    "healthCert" TEXT,
    "birthCert" TEXT,
    "branchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pass" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "duration" INTEGER NOT NULL,
    "description" TEXT,
    "features" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "type" TEXT NOT NULL DEFAULT 'INDIVIDUAL',
    "timeMode" TEXT NOT NULL DEFAULT 'full',
    "startTime" TEXT,
    "endTime" TEXT,
    "days" TEXT[],
    "maxParticipants" INTEGER NOT NULL DEFAULT 1,
    "targetAge" TEXT,
    "targetStatus" TEXT,
    "branchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pass_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pass" ADD CONSTRAINT "Pass_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
