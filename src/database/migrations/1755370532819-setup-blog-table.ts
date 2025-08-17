import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetupBlogTable1755370532819 implements MigrationInterface {
  name = 'SetupBlogTable1755370532819';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "blogs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, "title" character varying NOT NULL, "slug" character varying NOT NULL, "excerpt" text NOT NULL, "content" text NOT NULL, "profile_image" character varying, "tags" text, "meta_title" text, "meta_description" text, "arthurId" uuid, CONSTRAINT "UQ_7b18faaddd461656ff66f32e2d7" UNIQUE ("slug"), CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog_categories" ("blog_id" uuid NOT NULL, "category_id" uuid NOT NULL, CONSTRAINT "PK_859ff3241fe2e10de78c7479c71" PRIMARY KEY ("blog_id", "category_id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_3d1ce4f8ce43111c4db64d1e18" ON "blog_categories" ("blog_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_73cfc60ae668d6049fcb4ac1ee" ON "blog_categories" ("category_id") `);
    await queryRunner.query(
      `ALTER TABLE "blogs" ADD CONSTRAINT "FK_2a89135d8e818e61790882ee5b2" FOREIGN KEY ("arthurId") REFERENCES "admin_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories" ADD CONSTRAINT "FK_3d1ce4f8ce43111c4db64d1e186" FOREIGN KEY ("blog_id") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories" ADD CONSTRAINT "FK_73cfc60ae668d6049fcb4ac1eec" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "blog_categories" DROP CONSTRAINT "FK_73cfc60ae668d6049fcb4ac1eec"`);
    await queryRunner.query(`ALTER TABLE "blog_categories" DROP CONSTRAINT "FK_3d1ce4f8ce43111c4db64d1e186"`);
    await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "FK_2a89135d8e818e61790882ee5b2"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_73cfc60ae668d6049fcb4ac1ee"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_3d1ce4f8ce43111c4db64d1e18"`);
    await queryRunner.query(`DROP TABLE "blog_categories"`);
    await queryRunner.query(`DROP TABLE "blogs"`);
  }
}
