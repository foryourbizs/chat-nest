import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialTables1754641548653 implements MigrationInterface {
    name = 'InitialTables1754641548653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admins" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(200) NOT NULL, "password" character varying(255) NOT NULL, "refreshToken" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_051db7d37d478a69a7432df1479" UNIQUE ("email"), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ADMIN_EMAIL" ON "admins" ("email") `);
        await queryRunner.query(`CREATE TYPE "public"."users_provider_enum" AS ENUM('local', 'google', 'apple', 'kakao', 'naver')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(100), "email" character varying(200) NOT NULL, "password" character varying(255), "provider" "public"."users_provider_enum" NOT NULL DEFAULT 'local', "providerId" character varying(255), "refreshToken" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_USER_PROVIDER_ID" ON "users" ("providerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_USER_EMAIL_PROVIDER" ON "users" ("email", "provider") `);
        await queryRunner.query(`CREATE INDEX "IDX_USER_PROVIDER" ON "users" ("provider") `);
        await queryRunner.query(`CREATE INDEX "IDX_USER_EMAIL" ON "users" ("email") `);
        await queryRunner.query(`CREATE TABLE "characters" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" text, "avatar" character varying(500), "personality" text, "systemPrompt" text NOT NULL, "user_id" integer NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "usageCount" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9d731e05758f26b9315dac5e378" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_CHARACTER_NAME" ON "characters" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_CHARACTER_USER" ON "characters" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "conversations" ("id" SERIAL NOT NULL, "title" character varying(200), "user_id" integer NOT NULL, "character_id" integer NOT NULL, "messageCount" integer NOT NULL DEFAULT '0', "totalTokens" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_CONVERSATION_USER" ON "conversations" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_CONVERSATION_CHARACTER" ON "conversations" ("character_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_CONVERSATION_CREATED" ON "conversations" ("createdAt") `);
        await queryRunner.query(`CREATE TYPE "public"."messages_role_enum" AS ENUM('user', 'assistant', 'system')`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" SERIAL NOT NULL, "content" text NOT NULL, "role" "public"."messages_role_enum" NOT NULL, "conversation_id" integer NOT NULL, "tokenCount" integer NOT NULL DEFAULT '0', "metadata" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_MESSAGE_CONVERSATION" ON "messages" ("conversation_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_MESSAGE_ROLE" ON "messages" ("role") `);
        await queryRunner.query(`CREATE INDEX "IDX_MESSAGE_CREATED" ON "messages" ("createdAt") `);
        await queryRunner.query(`ALTER TABLE "characters" ADD CONSTRAINT "FK_c6e648aeaab79e4213def02aba8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "FK_3a9ae579e61e81cc0e989afeb4a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversations" ADD CONSTRAINT "FK_61a7e0353eeadb31a820017c02e" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE TABLE "query-result-cache" ("id" SERIAL NOT NULL, "identifier" character varying, "time" bigint NOT NULL, "duration" integer NOT NULL, "query" text NOT NULL, "result" text NOT NULL, CONSTRAINT "PK_6a98f758d8bfd010e7e10ffd3d3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "query-result-cache"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_61a7e0353eeadb31a820017c02e"`);
        await queryRunner.query(`ALTER TABLE "conversations" DROP CONSTRAINT "FK_3a9ae579e61e81cc0e989afeb4a"`);
        await queryRunner.query(`ALTER TABLE "characters" DROP CONSTRAINT "FK_c6e648aeaab79e4213def02aba8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_MESSAGE_CREATED"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_MESSAGE_ROLE"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_MESSAGE_CONVERSATION"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TYPE "public"."messages_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_CONVERSATION_CREATED"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_CONVERSATION_CHARACTER"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_CONVERSATION_USER"`);
        await queryRunner.query(`DROP TABLE "conversations"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_CHARACTER_USER"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_CHARACTER_NAME"`);
        await queryRunner.query(`DROP TABLE "characters"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_USER_EMAIL"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_USER_PROVIDER"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_USER_EMAIL_PROVIDER"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_USER_PROVIDER_ID"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_provider_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ADMIN_EMAIL"`);
        await queryRunner.query(`DROP TABLE "admins"`);
    }

}
