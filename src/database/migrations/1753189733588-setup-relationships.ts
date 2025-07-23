import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetupRelationships1753189733588 implements MigrationInterface {
  name = 'SetupRelationships1753189733588';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "categories_event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, "date_of_event" date NOT NULL, "event_time" TIME NOT NULL, "category_id" uuid, "league_id" uuid, CONSTRAINT "PK_39c8f73f2fcde968ed18ac99528" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "event_teams" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "deleted_at" TIMESTAMP, "event_id" uuid, "first_team_id" uuid, "second_team_id" uuid, CONSTRAINT "REL_b10f118ebff969c2f306569b16" UNIQUE ("event_id"), CONSTRAINT "PK_02a00c33f9aedce303aabb6ba16" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories_event" ADD CONSTRAINT "FK_ad56d49456289213fe49b74ba41" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories_event" ADD CONSTRAINT "FK_54c82d1053f21ec0434d5092539" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_teams" ADD CONSTRAINT "FK_b10f118ebff969c2f306569b160" FOREIGN KEY ("event_id") REFERENCES "categories_event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_teams" ADD CONSTRAINT "FK_9402c1b9336a396e9182c9643c6" FOREIGN KEY ("first_team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_teams" ADD CONSTRAINT "FK_35a8c39e7da444a4e84f675a83e" FOREIGN KEY ("second_team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event_teams" DROP CONSTRAINT "FK_35a8c39e7da444a4e84f675a83e"`);
    await queryRunner.query(`ALTER TABLE "event_teams" DROP CONSTRAINT "FK_9402c1b9336a396e9182c9643c6"`);
    await queryRunner.query(`ALTER TABLE "event_teams" DROP CONSTRAINT "FK_b10f118ebff969c2f306569b160"`);
    await queryRunner.query(`ALTER TABLE "categories_event" DROP CONSTRAINT "FK_54c82d1053f21ec0434d5092539"`);
    await queryRunner.query(`ALTER TABLE "categories_event" DROP CONSTRAINT "FK_ad56d49456289213fe49b74ba41"`);
    await queryRunner.query(`DROP TABLE "event_teams"`);
    await queryRunner.query(`DROP TABLE "categories_event"`);
  }
}
