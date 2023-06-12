/*
  Warnings:

  - A unique constraint covering the columns `[index]` on the table `Properties` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `index` to the `Properties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Properties" ADD COLUMN     "index" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Properties_index_key" ON "Properties"("index");
