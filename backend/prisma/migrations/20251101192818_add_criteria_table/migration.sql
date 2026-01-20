-- DropForeignKey
ALTER TABLE `Review` DROP FOREIGN KEY `EssayReview_essayId_fkey`;

-- CreateTable
CREATE TABLE `criteria` (
    `id` CHAR(36) NOT NULL,
    `criteriaType` ENUM('CONTENT', 'ORGANIZATION', 'GRAMMAR') NOT NULL,
    `score` FLOAT NOT NULL,
    `reviewId` CHAR(36) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_essayId_fkey` FOREIGN KEY (`essayId`) REFERENCES `essay`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `criteria` ADD CONSTRAINT `criteria_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `Review`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
