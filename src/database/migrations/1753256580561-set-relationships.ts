import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetRelationships1753256580561 implements MigrationInterface {
  name = 'SetRelationships1753256580561';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "leagues" ADD "is_top_league" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "leagues" ADD "category_id" uuid`);
    await queryRunner.query(`ALTER TABLE "teams" ADD "is_top_team" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(
      `ALTER TABLE "leagues" ADD CONSTRAINT "FK_2d05e2733f0b67d3aad0d3309e8" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "leagues" DROP CONSTRAINT "FK_2d05e2733f0b67d3aad0d3309e8"`);
    await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "is_top_team"`);
    await queryRunner.query(`ALTER TABLE "leagues" DROP COLUMN "category_id"`);
    await queryRunner.query(`ALTER TABLE "leagues" DROP COLUMN "is_top_league"`);
  }
}
