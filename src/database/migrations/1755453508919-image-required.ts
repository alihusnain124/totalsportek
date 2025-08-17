import { MigrationInterface, QueryRunner } from 'typeorm';

export class ImageRequired1755453508919 implements MigrationInterface {
  name = 'ImageRequired1755453508919';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "blogs" RENAME COLUMN "profile_image" TO "image"`);
    await queryRunner.query(`ALTER TABLE "blogs" ALTER COLUMN "image" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "blogs" ALTER COLUMN "image" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "blogs" RENAME COLUMN "image" TO "profile_image"`);
  }
}
