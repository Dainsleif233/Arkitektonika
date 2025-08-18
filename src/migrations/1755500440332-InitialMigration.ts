import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1755500440332 implements MigrationInterface {
    name = 'InitialMigration1755500440332'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Arkitektonika" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "size" integer NOT NULL, "sha1" character varying(40) NOT NULL, "delete" character varying NOT NULL, "download" character varying NOT NULL, "timestamp" integer NOT NULL, "valid" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_24a53ddbb274639b380ea0bc03f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "arkitektonika_idx_sha1" ON "Arkitektonika" ("sha1") `);
        await queryRunner.query(`CREATE INDEX "arkitektonika_idx_delete" ON "Arkitektonika" ("delete") `);
        await queryRunner.query(`CREATE INDEX "arkitektonika_idx_download" ON "Arkitektonika" ("download") `);
        await queryRunner.query(`CREATE INDEX "arkitektonika_idx_timestamp" ON "Arkitektonika" ("timestamp") `);
        await queryRunner.query(`CREATE INDEX "arkitektonika_idx_valid" ON "Arkitektonika" ("valid") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."arkitektonika_idx_valid"`);
        await queryRunner.query(`DROP INDEX "public"."arkitektonika_idx_timestamp"`);
        await queryRunner.query(`DROP INDEX "public"."arkitektonika_idx_download"`);
        await queryRunner.query(`DROP INDEX "public"."arkitektonika_idx_delete"`);
        await queryRunner.query(`DROP INDEX "public"."arkitektonika_idx_sha1"`);
        await queryRunner.query(`DROP TABLE "Arkitektonika"`);
    }

}
