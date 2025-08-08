import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  CurrentUser,
  CurrentUserData,
} from 'src/common/decorators/current-user.decorator';
import { AdminGuard } from 'src/guards/admin.guard';
import { MessageService } from '../../../message/message.service';
import { SendMessageDto } from '../../dto/send-message.dto';
import { ChatbotService } from '../../services/chatbot.service';

@Controller({
  path: 'admin/chatbot',
  version: '1',
})
export class AdminChatbotController {
  constructor(
    private readonly chatbotService: ChatbotService,
    private readonly messageService: MessageService,
  ) {}

  /**
   * 시스템 전체 ChatBot 통계 조회 (관리자만)
   */
  @Get('system-stats')
  @UseGuards(AdminGuard)
  async getSystemStats(@CurrentUser() currentUser: CurrentUserData) {
    const totalUsers = await this.chatbotService.getServiceStats(); // 전체 통계

    return {
      message: '시스템 전체 ChatBot 사용 통계',
      requestedBy: currentUser.email,
      stats: totalUsers,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 관리자 권한으로 메시지 전송 (모든 대화에 접근 가능)
   */
  @Post('send-message')
  @UseGuards(AdminGuard)
  async adminSendMessage(
    @CurrentUser() currentUser: CurrentUserData,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    // 관리자는 모든 대화에 메시지를 보낼 수 있음
    const result = await this.chatbotService.sendMessage(sendMessageDto); // 공개 서비스

    return {
      ...result,
      adminAction: {
        performedBy: currentUser.email,
        timestamp: new Date().toISOString(),
        note: '관리자 권한으로 수행된 작업',
      },
    };
  }

  /**
   * 모든 대화 요약 생성 (관리자만)
   */
  @Get('conversations/:conversationId/admin-summary')
  @UseGuards(AdminGuard)
  async getAdminConversationSummary(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    const summary =
      await this.chatbotService.getConversationSummary(conversationId);

    return {
      conversationId,
      summary,
      adminAction: {
        performedBy: currentUser.email,
        timestamp: new Date().toISOString(),
        note: '관리자 권한으로 생성된 요약',
      },
    };
  }

  /**
   * AI 모델 성능 통계 조회 (관리자만)
   */
  @Get('ai-performance')
  @UseGuards(AdminGuard)
  async getAiPerformanceStats(@CurrentUser() currentUser: CurrentUserData) {
    // 실제 구현에서는 더 복잡한 AI 성능 메트릭을 수집
    const messageStats = await this.messageService.getMessageStats(1); // 전체 통계

    return {
      message: 'AI 모델 성능 통계',
      requestedBy: currentUser.email,
      performance: {
        ...messageStats,
        avgResponseTime: '1.2초', // 실제로는 실시간으로 계산
        modelVersion: 'gpt-4-turbo',
        successRate: '98.5%',
        errorRate: '1.5%',
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 토큰 사용량 모니터링 (관리자만)
   */
  @Get('token-usage')
  @UseGuards(AdminGuard)
  async getTokenUsageMonitoring(@CurrentUser() currentUser: CurrentUserData) {
    // 실제로는 더 세밀한 토큰 사용량 분석
    const stats = await this.chatbotService.getServiceStats();

    return {
      message: '토큰 사용량 모니터링',
      requestedBy: currentUser.email,
      tokenUsage: {
        totalTokens: stats.totalMessages * 50, // 예시 계산
        dailyAverage: Math.round((stats.totalMessages * 50) / 30),
        monthlyEstimate: stats.totalMessages * 50 * 30,
        costEstimate: `$${(stats.totalMessages * 50 * 0.002).toFixed(2)}`, // 예시 비용
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 특정 사용자의 ChatBot 사용 이력 조회 (관리자만)
   */
  @Get('users/:userId/activity')
  @UseGuards(AdminGuard)
  async getUserActivity(
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    const userStats = await this.chatbotService.getServiceStats(); // 공개 서비스에서는 전체 통계만 제공

    return {
      message: `사용자 ID ${userId}의 ChatBot 활동 내역`,
      requestedBy: currentUser.email,
      userActivity: userStats,
      timestamp: new Date().toISOString(),
    };
  }
}
