/*
  Warnings:

  - You are about to drop the `CallSheet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClientProject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductionCompany` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductionCompanyProject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectManager` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectManagerProject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CallSheet" DROP CONSTRAINT "CallSheet_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ClientProject" DROP CONSTRAINT "ClientProject_clientId_fkey";

-- DropForeignKey
ALTER TABLE "ClientProject" DROP CONSTRAINT "ClientProject_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProductionCompanyProject" DROP CONSTRAINT "ProductionCompanyProject_productionCompanyId_fkey";

-- DropForeignKey
ALTER TABLE "ProductionCompanyProject" DROP CONSTRAINT "ProductionCompanyProject_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectManagerProject" DROP CONSTRAINT "ProjectManagerProject_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectManagerProject" DROP CONSTRAINT "ProjectManagerProject_projectManagerId_fkey";

-- DropTable
DROP TABLE "CallSheet";

-- DropTable
DROP TABLE "Client";

-- DropTable
DROP TABLE "ClientProject";

-- DropTable
DROP TABLE "ProductionCompany";

-- DropTable
DROP TABLE "ProductionCompanyProject";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "ProjectManager";

-- DropTable
DROP TABLE "ProjectManagerProject";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionCompanies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductionCompanies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectManagers" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectManagers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clients" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "streetAddress" TEXT,
    "streetAddress2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "contactPersonFirst" TEXT,
    "contactPersonLast" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projects" (
    "id" SERIAL NOT NULL,
    "projectName" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "projectNumber" INTEGER NOT NULL DEFAULT 1000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionCompanyProjects" (
    "productionCompanyId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "ProductionCompanyProjects_pkey" PRIMARY KEY ("productionCompanyId","projectId")
);

-- CreateTable
CREATE TABLE "ProjectManagerProjects" (
    "projectManagerId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "ProjectManagerProjects_pkey" PRIMARY KEY ("projectManagerId","projectId")
);

-- CreateTable
CREATE TABLE "ClientProjects" (
    "clientId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "ClientProjects_pkey" PRIMARY KEY ("clientId","projectId")
);

-- CreateTable
CREATE TABLE "CallSheets" (
    "id" SERIAL NOT NULL,
    "callSheetDate" TIMESTAMP(3) NOT NULL,
    "shootLocation" TEXT NOT NULL,
    "streetAddress" TEXT,
    "streetAddress2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "parkingNotes" TEXT,
    "projectId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CallSheets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionCompanies_name_key" ON "ProductionCompanies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionCompanies_email_key" ON "ProductionCompanies"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectManagers_email_key" ON "ProjectManagers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Clients_email_key" ON "Clients"("email");

-- AddForeignKey
ALTER TABLE "ProductionCompanyProjects" ADD CONSTRAINT "ProductionCompanyProjects_productionCompanyId_fkey" FOREIGN KEY ("productionCompanyId") REFERENCES "ProductionCompanies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionCompanyProjects" ADD CONSTRAINT "ProductionCompanyProjects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectManagerProjects" ADD CONSTRAINT "ProjectManagerProjects_projectManagerId_fkey" FOREIGN KEY ("projectManagerId") REFERENCES "ProjectManagers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectManagerProjects" ADD CONSTRAINT "ProjectManagerProjects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientProjects" ADD CONSTRAINT "ClientProjects_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientProjects" ADD CONSTRAINT "ClientProjects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallSheets" ADD CONSTRAINT "CallSheets_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
