-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DELIVERED', 'APPROVED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" "Status" NOT NULL DEFAULT E'DELIVERED';
