/*
  Warnings:

  - Added the required column `typeId` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `typeId` TINYINT NOT NULL;

-- CreateTable
CREATE TABLE `UserType` (
    `id` TINYINT NOT NULL,
    `label` CHAR(8) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `UserType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
