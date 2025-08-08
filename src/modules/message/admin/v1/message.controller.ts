import { BeforeCreate, BeforeUpdate, Crud } from '@foryourdev/nestjs-crud';
import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  CurrentUser,
  CurrentUserData,
} from 'src/common/decorators/current-user.decorator';
import { AdminGuard } from 'src/guards/admin.guard';
import { Message, MessageRole } from '../../message.entity';
import { MessageService } from '../../message.service';

@Crud({
  entity: Message,
  allowedFilters: ['conversationId', 'role', 'content'],
  allowedIncludes: ['conversation'],
  only: ['index', 'show', 'create', 'update', 'destroy'],
  routes: {
    index: {
      allowedFilters: ['conversationId', 'role', 'content'],
      allowedIncludes: ['conversation'],
    },
    show: {
      allowedIncludes: ['conversation'],
    },
    create: {
      allowedParams: [
        'content',
        'role',
        'conversationId',
        'tokenCount',
        'metadata',
      ],
    },
    update: {
      allowedParams: ['content', 'metadata'],
    },
  },
})
@Controller({
  path: 'admin/messages',
  version: '1',
})
export class AdminMessageController {
  constructor(public readonly crudService: MessageService) {}

  @BeforeCreate()
  @BeforeUpdate()
  async validateMessageData(body: any) {
    // 관리자용 메시지 생성/수정시 추가 유효성 검사나 처리 로직
    if (body.content && body.content.length > 10000) {
      throw new Error('메시지 내용은 10000자를 초과할 수 없습니다.');
    }

    if (body.role && !Object.values(MessageRole).includes(body.role)) {
      throw new Error('유효하지 않은 메시지 역할입니다.');
    }

    return body;
  }

  /**
   * 모든 메시지 통계 조회 (관리자만)
   */
  @Get('stats')
  @UseGuards(AdminGuard)
  async getMessageStats(@CurrentUser() currentUser: CurrentUserData) {
    const totalMessages = await this.crudService.messageRepository.count();

    const roleStats = await this.crudService.messageRepository
      .createQueryBuilder('message')
      .select([
        'message.role as role',
        'COUNT(*) as count',
        'SUM(message.tokenCount) as totalTokens',
        'AVG(message.tokenCount) as avgTokens',
      ])
      .groupBy('message.role')
      .getRawMany();

    const totalTokens = await this.crudService.messageRepository
      .createQueryBuilder('message')
      .select('SUM(message.tokenCount)', 'sum')
      .getRawOne();

    return {
      totalMessages,
      totalTokens: parseInt(totalTokens.sum) || 0,
      roleBreakdown: roleStats.map((stat) => ({
        role: stat.role,
        count: parseInt(stat.count),
        totalTokens: parseInt(stat.totalTokens) || 0,
        avgTokens: parseFloat(stat.avgTokens) || 0,
      })),
    };
  }

  /**
   * 토큰 사용량이 높은 메시지 조회 (관리자만)
   */
  @Get('high-token-usage')
  @UseGuards(AdminGuard)
  async getHighTokenUsageMessages(@CurrentUser() currentUser: CurrentUserData) {
    return await this.crudService.messageRepository.find({
      order: { tokenCount: 'DESC' },
      take: 50,
      relations: ['conversation', 'conversation.user'],
      select: {
        id: true,
        content: true,
        role: true,
        tokenCount: true,
        createdAt: true,
        conversation: {
          id: true,
          title: true,
          user: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * 특정 대화의 모든 메시지 삭제 (관리자만)
   */
  @Delete('conversation/:conversationId')
  @UseGuards(AdminGuard)
  async deleteConversationMessages(
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @CurrentUser() currentUser: CurrentUserData,
  ) {
    const result = await this.crudService.messageRepository.delete({
      conversationId,
    });

    return {
      message: `대화 ID ${conversationId}의 메시지가 삭제되었습니다.`,
      deletedCount: result.affected || 0,
      deletedBy: currentUser.email,
    };
  }
}
