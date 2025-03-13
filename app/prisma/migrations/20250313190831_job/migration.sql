-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'ACTIVE', 'DELIVERED');

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "shipperId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "distance" INTEGER NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_shipperId_fkey" FOREIGN KEY ("shipperId") REFERENCES "ShipperProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
