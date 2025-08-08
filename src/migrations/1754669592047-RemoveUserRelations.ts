import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUserRelations1754669592047 implements MigrationInterface {
    name = 'RemoveUserRelations1754669592047'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "characters" DROP CONSTRAINT "FK_c6e648aeaab79e4213def02aba8"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_3a9ae579e61e81cc0e989afeb4a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_CHARACTER_USER"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_CONVERSATION_USER"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP COLUMN "user_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversations" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "characters" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_CONVERSATION_USER" ON "conversations" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_CHARACTER_USER" ON "characters" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "FK_3a9ae579e61e81cc0e989afeb4a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "characters" ADD CONSTRAINT "FK_c6e648aeaab79e4213def02aba8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
