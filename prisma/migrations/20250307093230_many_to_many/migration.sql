/*
  Warnings:

  - You are about to drop the column `clientId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `productionCompanyId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `projectManagerId` on the `Project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_productionCompanyId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_projectManagerId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "clientId",
DROP COLUMN "productionCompanyId",
DROP COLUMN "projectManagerId";

-- CreateTable
CREATE TABLE "ProductionCompanyProject" (
    "productionCompanyId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "ProductionCompanyProject_pkey" PRIMARY KEY ("productionCompanyId","projectId")
);

-- CreateTable
CREATE TABLE "ProjectManagerProject" (
    "projectManagerId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "ProjectManagerProject_pkey" PRIMARY KEY ("projectManagerId","projectId")
);

-- CreateTable
CREATE TABLE "ClientProject" (
    "clientId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "ClientProject_pkey" PRIMARY KEY ("clientId","projectId")
);

-- AddForeignKey
ALTER TABLE "ProductionCompanyProject" ADD CONSTRAINT "ProductionCompanyProject_productionCompanyId_fkey" FOREIGN KEY ("productionCompanyId") REFERENCES "ProductionCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionCompanyProject" ADD CONSTRAINT "ProductionCompanyProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectManagerProject" ADD CONSTRAINT "ProjectManagerProject_projectManagerId_fkey" FOREIGN KEY ("projectManagerId") REFERENCES "ProjectManager"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectManagerProject" ADD CONSTRAINT "ProjectManagerProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientProject" ADD CONSTRAINT "ClientProject_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientProject" ADD CONSTRAINT "ClientProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
