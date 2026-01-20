-- CreateTable
CREATE TABLE `essay` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `proposalId` CHAR(36) NOT NULL,
    `text` TEXT NOT NULL,
    `status` ENUM('DRAFT', 'SUBMITTED') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `essay` ADD CONSTRAINT `essay_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `essay` ADD CONSTRAINT `essay_proposalId_fkey` FOREIGN KEY (`proposalId`) REFERENCES `proposal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
