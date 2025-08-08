import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminGuard } from '../../guards/admin.guard';
import { Conversation } from '../conversation/conversation.entity';
import { ConversationModule } from '../conversation/conversation.module';
import { AdminMessageController } from './admin/v1/message.controller';
import { MessageController } from './api/v1/message.controller';
import { Message } from './message.entity';
import { MessageService } from './message.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Conversation]),
    forwardRef(() => ConversationModule),
  ],
  controllers: [MessageController, AdminMessageController],
  providers: [MessageService, AdminGuard],
  exports: [MessageService],
})
export class MessageModule {}
