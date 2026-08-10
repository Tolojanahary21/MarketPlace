/*
  Warnings:

  - You are about to drop the column `telephone` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `fax` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `telephone` on the `suppliers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `clients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `suppliers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "clients" DROP COLUMN "telephone",
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "suppliers" DROP COLUMN "fax",
DROP COLUMN "telephone",
ADD COLUMN     "userId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "clients_userId_key" ON "clients"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_userId_key" ON "suppliers"("userId");

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
