-- CreateTable
CREATE TABLE "CrewMembers" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "rolePosition" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "streetAddress" TEXT,
    "streetAddress2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "projectManagerId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrewMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectCrewMembers" (
    "projectId" INTEGER NOT NULL,
    "crewMemberId" INTEGER NOT NULL,

    CONSTRAINT "ProjectCrewMembers_pkey" PRIMARY KEY ("projectId","crewMemberId")
);

-- CreateIndex
CREATE UNIQUE INDEX "CrewMembers_email_key" ON "CrewMembers"("email");

-- AddForeignKey
ALTER TABLE "CrewMembers" ADD CONSTRAINT "CrewMembers_projectManagerId_fkey" FOREIGN KEY ("projectManagerId") REFERENCES "ProjectManagers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectCrewMembers" ADD CONSTRAINT "ProjectCrewMembers_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectCrewMembers" ADD CONSTRAINT "ProjectCrewMembers_crewMemberId_fkey" FOREIGN KEY ("crewMemberId") REFERENCES "CrewMembers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
