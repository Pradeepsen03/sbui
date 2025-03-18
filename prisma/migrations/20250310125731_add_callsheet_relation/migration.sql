-- CreateTable
CREATE TABLE "CallSheet" (
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

    CONSTRAINT "CallSheet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CallSheet" ADD CONSTRAINT "CallSheet_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
