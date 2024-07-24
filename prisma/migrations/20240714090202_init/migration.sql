-- CreateTable
CREATE TABLE `Studio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` LONGBLOB NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('USER', 'ADMIN', 'OWNER') NOT NULL DEFAULT 'USER',
    `instagram` VARCHAR(191) NULL,
    `accessToken` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pembayaran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jumlah` DOUBLE NOT NULL,
    `metode` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `waktuBayar` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pemesananId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pemesanan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `totalHarga` DOUBLE NOT NULL,
    `waktuPesan` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tanggalMulai` DATETIME(3) NOT NULL,
    `tanggalSelesai` DATETIME(3) NOT NULL,
    `durasi` INTEGER NOT NULL,
    `studioId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pembayaran` ADD CONSTRAINT `pembayaran_pemesananId_fkey` FOREIGN KEY (`pemesananId`) REFERENCES `pemesanan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pemesanan` ADD CONSTRAINT `pemesanan_studioId_fkey` FOREIGN KEY (`studioId`) REFERENCES `Studio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pemesanan` ADD CONSTRAINT `pemesanan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
