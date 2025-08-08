import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DATABASE_CONFIG,
  validateDatabaseConfig,
} from '../config/database.config';
import { JWT_CONFIG, validateJwtConfig } from '../config/jwt.config';
import { OpenAIConfig } from '../config/openai.config';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { SchemaModule } from './schema/schema.module';
import { UserModule } from './users/user.module';

// 새로운 모듈 구조 - 엔티티별 독립 모듈
import { CharacterModule } from './character/character.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      ...JWT_CONFIG,
      global: true,
    }),
    TypeOrmModule.forRoot(DATABASE_CONFIG),
    UserModule,
    AuthModule,
    AdminModule,

    // AI 챗봇 관련 모듈들 (엔티티별 분리)
    CharacterModule,
    ConversationModule,
    MessageModule,
    ChatbotModule, // AI 기능만 담당

    // 개발 환경에서만 스키마 모듈 등록
    ...(process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
      ? [SchemaModule]
      : []),
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    console.log('🚀 Application Configuration Validation:');
    validateDatabaseConfig();
    validateJwtConfig();

    // OpenAI 설정 검증
    try {
      OpenAIConfig.validateConfig(this.configService);
    } catch (error) {
      console.warn('⚠️  OpenAI Configuration Warning:', error.message);
      console.warn(
        '   Chatbot functionality will be limited without proper OpenAI setup',
      );
    }

    console.log('✅ All configurations validated successfully!\n');
  }
}
