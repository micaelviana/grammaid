/*
  Warnings:

  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - Added the required column `nome` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `name`,
    DROP COLUMN `password`,
    ADD COLUMN `nome` VARCHAR(191) NOT NULL,
    ADD COLUMN `senha` VARCHAR(191) NOT NULL;
