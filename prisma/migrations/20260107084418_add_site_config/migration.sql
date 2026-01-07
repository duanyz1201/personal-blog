-- CreateTable
CREATE TABLE `SiteConfig` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `siteName` VARCHAR(191) NOT NULL DEFAULT '我的技术博客',
    `description` TEXT NULL,
    `about` LONGTEXT NULL,
    `github` VARCHAR(191) NULL,
    `twitter` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
