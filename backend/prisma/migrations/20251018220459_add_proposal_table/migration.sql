/*
  Warnings:

  - Added the required column `minWords` to the `proposal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `proposal` ADD COLUMN `minWords` INTEGER NOT NULL;
