/*
  Warnings:

  - You are about to drop the column `shopId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shopId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Shop` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[zipCode]` on the table `Address` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_shopId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_shopId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "shopId";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "shopId";

-- DropTable
DROP TABLE "Shop";

-- CreateIndex
CREATE UNIQUE INDEX "Address_zipCode_key" ON "Address"("zipCode");
