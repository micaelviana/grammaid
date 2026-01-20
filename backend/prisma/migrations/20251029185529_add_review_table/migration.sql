-- CreateTable
CREATE TABLE `EssayReview` (
    `id` CHAR(36) NOT NULL,
    `essayId` CHAR(36) NOT NULL,
    `score` FLOAT NOT NULL,
    `comment` TEXT NOT NULL,
    `modelVersion` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EssayReview` ADD CONSTRAINT `EssayReview_essayId_fkey` FOREIGN KEY (`essayId`) REFERENCES `essay`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
