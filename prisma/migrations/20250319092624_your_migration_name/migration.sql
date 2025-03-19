/*
  Warnings:

  - You are about to drop the `Equipment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Equipment" DROP CONSTRAINT "Equipment_crewMemberId_fkey";

-- DropTable
DROP TABLE "Equipment";

-- CreateTable
CREATE TABLE "Equipments" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "streetAddress" TEXT,
    "streetAddress2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "crewMemberId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Equipments" ADD CONSTRAINT "Equipments_crewMemberId_fkey" FOREIGN KEY ("crewMemberId") REFERENCES "CrewMembers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
