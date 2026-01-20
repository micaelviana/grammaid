/*
  Warnings:

  - You are about to drop the column `proficiency` on the `user` table. All the data in the column will be lost.
  - Added the required column `level` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `proficiency`,
    ADD COLUMN `level` ENUM('BASIC', 'INTERMEDIATE', 'ADVANCED') NOT NULL;

-- CreateTable
CREATE TABLE `proposal` (
    `id` CHAR(36) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `text` TEXT NOT NULL,
    `level` ENUM('BASIC', 'INTERMEDIATE', 'ADVANCED') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
