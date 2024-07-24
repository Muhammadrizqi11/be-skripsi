/*
  Warnings:

  - Added the required column `ownerId` to the `Studio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `studio` ADD COLUMN `ownerId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Studio` ADD CONSTRAINT `Studio_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
