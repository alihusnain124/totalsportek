import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStreamUrl1755456465537 implements MigrationInterface {
  name = 'AddStreamUrl1755456465537';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "categories_event" ADD "stream_url" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "categories_event" DROP COLUMN "stream_url"`);
  }
}
