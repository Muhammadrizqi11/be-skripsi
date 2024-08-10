/*
  Warnings:

  - Added the required column `paket` to the `Studio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Studio" ADD COLUMN     "paket" TEXT NOT NULL;
