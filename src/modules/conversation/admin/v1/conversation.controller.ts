import { BeforeCreate, BeforeUpdate, Crud } from '@foryourdev/nestjs-crud';
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  CurrentUser,
  CurrentUserData,
} from 'src/common/decorators/current-user.decorator';
import { AdminGuard } from 'src/guards/admin.guard';
import { Conversation } from '../../conversation.entity';
import { ConversationService } from '../../conversation.service';

@Crud({
  entity: Conversation,
  allowedFilters: ['characterId', 'isActive', 'userId', 'title'],
  allowedIncludes: ['user', 'character', 'messages'],
  only: ['index', 'show', 'create', 'update', 'destroy'],
  routes: {
    index: {
      allowedFilters: ['characterId', 'isActive', 'userId', 'title'],
      allowedIncludes: ['user', 'character', 'messages'],
    },
    show: {
      allowedIncludes: ['user', 'character', 'messages'],
    },
    create: {
      allowedParams: ['title', 'userId', 'characterId'],
    },
    update: {
      allowedParams: ['title', 'isActive'],
    },
  },
})
@Controller({
  path: 'admin/conversations',
  version: '1',
})
export class AdminConversationController {
  constructor(public readonly crudService: ConversationService) {}

  @BeforeCreate()
  @BeforeUpdate()
  async validateConversationData(body: any) {
    // 관리자용 대화 생성/수정시 추가 유효성 검사나 처리 로직
    if (body.title && body.title.length > 200) {
      throw new Error('대화 제목은 200자를 초과할 수 없습니다.');
    }

    return body;
  }

  /**
   * 모든 사용자의 대화 통계 조회 (관리자만)
   */
  @Get('stats')
  @UseGuards(AdminGuard)
  async getConversationStats(@CurrentUser() currentUser: CurrentUserData) {
    const totalConversations =
      await this.crudService.conversationRepository.count();
    const activeConversations =
      await this.crudService.conversationRepository.count({
        where: { isActive: true },
      });

    const result = await this.crudService.conversationRepository
      .createQueryBuilder('conversation')
      .select([
        'SUM(conversation.messageCount) as totalMessages',
        'SUM(conversation.totalTokens) as totalTokens',
        'AVG(conversation.messageCount) as avgMessagesPerConversation',
      ])
      .getRawOne();

    return {
      totalConversations,
      activeConversations,
      inactiveConversations: totalConversations - activeConversations,
      totalMessages: parseInt(result.totalMessages) || 0,
      totalTokens: parseInt(result.totalTokens) || 0,
      avgMessagesPerConversation:
        parseFloat(result.avgMessagesPerConversation) || 0,
    };
  }

  /**
   * 대화량이 많은 사용자 Top 10 조회 (관리자만)
   */
  @Get('top-users')
  @UseGuards(AdminGuard)
  async getTopConversationUsers(@CurrentUser() currentUser: CurrentUserData) {
    return await this.crudService.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoin('conversation.user', 'user')
      .select([
        'user.id as userId',
        'user.name as userName',
        'user.email as userEmail',
        'COUNT(conversation.id) as conversationCount',
        'SUM(conversation.messageCount) as totalMessages',
        'SUM(conversation.totalTokens) as totalTokens',
      ])
      .where('conversation.isActive = :isActive', { isActive: true })
      .groupBy('user.id, user.name, user.email')
      .orderBy('COUNT(conversation.id)', 'DESC')
      .limit(10)
      .getRawMany();
  }
}
