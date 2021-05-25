import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1621912675931 implements MigrationInterface {
    name = 'Initial1621912675931'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `username` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, UNIQUE INDEX `IDX_78a916df40e02a9deb1c4b75ed` (`username`), UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `updoot` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `value` int NOT NULL, `userId` int NOT NULL, `postId` int NOT NULL, PRIMARY KEY (`userId`, `postId`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `post` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `title` varchar(255) NOT NULL, `text` varchar(255) NOT NULL, `points` int NOT NULL DEFAULT '0', `creatorId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `updoot` ADD CONSTRAINT `FK_9df9e319a273ad45ce509cf2f68` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `updoot` ADD CONSTRAINT `FK_fd6b77bfdf9eae6691170bc9cb5` FOREIGN KEY (`postId`) REFERENCES `post`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `post` ADD CONSTRAINT `FK_9e91e6a24261b66f53971d3f96b` FOREIGN KEY (`creatorId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `post` DROP FOREIGN KEY `FK_9e91e6a24261b66f53971d3f96b`");
        await queryRunner.query("ALTER TABLE `updoot` DROP FOREIGN KEY `FK_fd6b77bfdf9eae6691170bc9cb5`");
        await queryRunner.query("ALTER TABLE `updoot` DROP FOREIGN KEY `FK_9df9e319a273ad45ce509cf2f68`");
        await queryRunner.query("DROP TABLE `post`");
        await queryRunner.query("DROP TABLE `updoot`");
        await queryRunner.query("DROP INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` ON `user`");
        await queryRunner.query("DROP INDEX `IDX_78a916df40e02a9deb1c4b75ed` ON `user`");
        await queryRunner.query("DROP TABLE `user`");
    }

}
