-- AlterTable
ALTER TABLE "ShipperProfile" ADD COLUMN     "companyType" TEXT,
ALTER COLUMN "companyName" DROP NOT NULL;
