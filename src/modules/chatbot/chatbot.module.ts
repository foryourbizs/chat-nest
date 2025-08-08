import { Module } from '@nestjs/common';

// AI 챗봇 기능만 담당
import { AdminChatbotController } from './admin/v1/chatbot.controller';
import { ChatbotController } from './api/v1/chatbot.controller';
import { ChatbotService } from './services/chatbot.service';

// 의존 모듈들
import { AdminGuard } from '../../guards/admin.guard';
import { CharacterModule } from '../character/character.module';
import { ConversationModule } from '../conversation/conversation.module';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [
    // 각 엔티티별 모듈들을 import
    CharacterModule,
    ConversationModule,
    MessageModule,
  ],
  controllers: [ChatbotController, AdminChatbotController],
  providers: [ChatbotService, AdminGuard],
  exports: [ChatbotService],
})
export class ChatbotModule {}
