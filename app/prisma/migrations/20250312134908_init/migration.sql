-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('TRUCKER', 'SHIPPER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TruckerProfile" (
    "userId" TEXT NOT NULL,
    "licenseNo" TEXT NOT NULL,
    "truckAge" INTEGER NOT NULL,
    "minSalary" INTEGER NOT NULL,
    "maxDistance" INTEGER NOT NULL,
    "hasAccidentHistory" BOOLEAN NOT NULL DEFAULT false,
    "hasTheftHistory" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TruckerProfile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "ShipperProfile" (
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,

    CONSTRAINT "ShipperProfile_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TruckerProfile_licenseNo_key" ON "TruckerProfile"("licenseNo");

-- AddForeignKey
ALTER TABLE "TruckerProfile" ADD CONSTRAINT "TruckerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipperProfile" ADD CONSTRAINT "ShipperProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
