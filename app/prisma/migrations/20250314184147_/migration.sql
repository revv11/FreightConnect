/*
  Warnings:

  - A unique constraint covering the columns `[truckerId]` on the table `Job` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "truckerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Job_truckerId_key" ON "Job"("truckerId");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_truckerId_fkey" FOREIGN KEY ("truckerId") REFERENCES "TruckerProfile"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
