import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameCamelCaseColumns1754670381576 implements MigrationInterface {
    name = 'RenameCamelCaseColumns1754670381576'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_61a7e0353eeadb31a820017c02e"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_CONVERSATION_CHARACTER"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_MESSAGE_CONVERSATION"`);
        await queryRunner.query(`ALTER TABLE "conversations" RENAME COLUMN "character_id" TO "characterId"`);
        await queryRunner.query(`ALTER TABLE "messages" RENAME COLUMN "conversation_id" TO "conversationId"`);
        await queryRunner.query(`CREATE INDEX "IDX_CONVERSATION_CHARACTER" ON "conversations" ("characterId") `);
        await queryRunner.query(`CREATE INDEX "IDX_MESSAGE_CONVERSATION" ON "messages" ("conversationId") `);
        await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "FK_3627a773c1d06772941291d458c" FOREIGN KEY ("characterId") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_e5663ce0c730b2de83445e2fd19" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_e5663ce0c730b2de83445e2fd19"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_3627a773c1d06772941291d458c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_MESSAGE_CONVERSATION"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_CONVERSATION_CHARACTER"`);
        await queryRunner.query(`ALTER TABLE "messages" RENAME COLUMN "conversationId" TO "conversation_id"`);
        await queryRunner.query(`ALTER TABLE "conversations" RENAME COLUMN "characterId" TO "character_id"`);
        await queryRunner.query(`CREATE INDEX "IDX_MESSAGE_CONVERSATION" ON "messages" ("conversation_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_CONVERSATION_CHARACTER" ON "conversations" ("character_id") `);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "FK_61a7e0353eeadb31a820017c02e" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
