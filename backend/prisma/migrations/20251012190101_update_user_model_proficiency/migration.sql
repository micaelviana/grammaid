/*
  Warnings:

  - You are about to drop the column `proficiency_level` on the `user` table. All the data in the column will be lost.
  - Added the required column `proficiency` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `proficiency_level`,
    ADD COLUMN `proficiency` ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') NOT NULL;
