/*
  Warnings:

  - You are about to drop the `auth_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `auth_tokens` DROP FOREIGN KEY `auth_tokens_ibfk_1`;

-- DropTable
DROP TABLE `auth_tokens`;

-- CreateTable
CREATE TABLE `refresh_tokens` (
    `id` VARCHAR(191) NOT NULL,
    `session_token` VARCHAR(191) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `refresh_tokens.user_id_unique`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cities` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `acronym` VARCHAR(191),
    `identifier` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `districts` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `city_id` VARCHAR(191) NOT NULL,

    INDEX `city_id`(`city_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ceps` (
    `id` VARCHAR(191) NOT NULL,
    `cep` INTEGER NOT NULL,
    `place_type` VARCHAR(191) NOT NULL,
    `route` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `addresses` (
    `id` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191),
    `complement` VARCHAR(191),
    `reference` VARCHAR(191),
    `cep_id` VARCHAR(191) NOT NULL,
    `district_id` VARCHAR(191) NOT NULL,

    INDEX `cep_id`(`cep_id`),
    INDEX `district_id`(`district_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `branch_head_offices` (
    `id` VARCHAR(191) NOT NULL,
    `identifier` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `branch_head_offices.identifier_unique`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `enterprise_registrations` (
    `id` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `reason` INTEGER NOT NULL,

    UNIQUE INDEX `enterprise_registrations.status_unique`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cnaes` (
    `id` VARCHAR(191) NOT NULL,
    `number` BIGINT NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `is_fiscal` BOOLEAN NOT NULL,
    `enterprise_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `cnaes.number_unique`(`number`),
    INDEX `enterprise_id`(`enterprise_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `business_sizes` (
    `id` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `enterprises` (
    `id` VARCHAR(191) NOT NULL,
    `cnpj` VARCHAR(191) NOT NULL,
    `corporate_name` VARCHAR(191) NOT NULL,
    `fantasy_name` VARCHAR(191) NOT NULL,
    `outside_city_name` VARCHAR(191),
    `legal_nature_code` BIGINT,
    `activity_start_date` DATETIME(3) NOT NULL,
    `qualification_of_the_responsible` INTEGER NOT NULL,
    `share_capital` BIGINT NOT NULL,
    `branch_head_office_id` VARCHAR(191) NOT NULL,
    `enterprise_registration_id` VARCHAR(191) NOT NULL,
    `address_id` VARCHAR(191) NOT NULL,
    `business_size_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `enterprises.cnpj_unique`(`cnpj`),
    INDEX `address_id`(`address_id`),
    INDEX `branch_head_office_id`(`branch_head_office_id`),
    INDEX `business_size_id`(`business_size_id`),
    INDEX `enterprise_registration_id`(`enterprise_registration_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meis` (
    `id` VARCHAR(191) NOT NULL,
    `special_situation` VARCHAR(191),
    `situation_date` DATETIME(3),
    `enterprise_id` VARCHAR(191) NOT NULL,

    INDEX `enterprise_id`(`enterprise_id`),
    UNIQUE INDEX `meis_enterprise_id_unique`(`enterprise_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `national_simples` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3),
    `exclusion_date` DATETIME(3),
    `enterprise_id` VARCHAR(191) NOT NULL,

    INDEX `enterprise_id`(`enterprise_id`),
    UNIQUE INDEX `national_simples_enterprise_id_unique`(`enterprise_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phones` (
    `id` VARCHAR(191) NOT NULL,
    `country_code` VARCHAR(191),
    `ddd` INTEGER,
    `number` INTEGER NOT NULL,
    `type` ENUM('fax', 'mobile', 'local') NOT NULL,
    `enterprise_id` VARCHAR(191) NOT NULL,

    INDEX `enterprise_id`(`enterprise_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `districts` ADD FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `addresses` ADD FOREIGN KEY (`cep_id`) REFERENCES `ceps`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `addresses` ADD FOREIGN KEY (`district_id`) REFERENCES `districts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cnaes` ADD FOREIGN KEY (`enterprise_id`) REFERENCES `enterprises`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enterprises` ADD FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enterprises` ADD FOREIGN KEY (`branch_head_office_id`) REFERENCES `branch_head_offices`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enterprises` ADD FOREIGN KEY (`business_size_id`) REFERENCES `business_sizes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enterprises` ADD FOREIGN KEY (`enterprise_registration_id`) REFERENCES `enterprise_registrations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meis` ADD FOREIGN KEY (`enterprise_id`) REFERENCES `enterprises`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `national_simples` ADD FOREIGN KEY (`enterprise_id`) REFERENCES `enterprises`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `phones` ADD FOREIGN KEY (`enterprise_id`) REFERENCES `enterprises`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
