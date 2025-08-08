import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { MessageService } from '../../../message/message.service';
import { SendMessageDto } from '../../dto/send-message.dto';
import { ChatbotService } from '../../services/chatbot.service';

@Controller({
  path: 'chatbot',
  version: '1',
})
export class ChatbotController {
  constructor(
    private readonly chatbotService: ChatbotService,
    private readonly messageService: MessageService,
  ) {}

  // 이 컨트롤러는 순수한 ChatBot 기능 (AI 응답)에만 집중 (테스트용 - 인증 불필요)
  // 일반적인 CRUD는 각각의 전용 컨트롤러에서 처리

  /**
   * 메시지 전송 및 AI 응답 받기 (공개 서비스)
   */
  @Post('send-message')
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return await this.chatbotService.sendMessage(sendMessageDto);
  }

  // 대화의 메시지 목록 조회는 MessageController로 이동됨
  // GET /api/v1/messages/conversation/:conversationId 사용
  // 또는 GET /api/v1/messages?filter=conversationId||$eq||{conversationId} 사용

  /**
   * 대화 요약 생성 (테스트용 - 소유권 확인 없음)
   */
  @Get('conversations/:conversationId/summary')
  async getConversationSummary(
    @Param('conversationId', ParseIntPipe) conversationId: number,
  ) {
    // 공개 서비스이므로 소유권 확인 없이 요약 생성
    const summary =
      await this.chatbotService.getConversationSummary(conversationId);
    return summary;
  }

  /**
   * 전체 서비스 통계 (공개 서비스)
   */
  @Get('stats')
  async getServiceStats() {
    return await this.chatbotService.getServiceStats();
  }
}
