import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminGuard } from '../../guards/admin.guard';
import { AdminConversationController } from './admin/v1/conversation.controller';
import { ConversationController } from './api/v1/conversation.controller';
import { Conversation } from './conversation.entity';
import { ConversationService } from './conversation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation]),
    // MessageModule과의 순환 의존성으로 인해 forwardRef는 필요시에만 추가
  ],
  controllers: [ConversationController, AdminConversationController],
  providers: [ConversationService, AdminGuard],
  exports: [ConversationService],
})
export class ConversationModule {}
