import { Crud } from '@foryourdev/nestjs-crud';
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Message } from '../../message.entity';
import { MessageService } from '../../message.service';

@Crud({
  entity: Message,
  // 메시지는 읽기 위주, 생성은 chatbot 서비스를 통해서만
  only: ['index', 'show'],

  // 필터링 옵션
  allowedFilters: ['conversationId', 'role', 'content'],

  // 정렬은 쿼리 파라미터로 지원 (?sort=field,order)

  // 관계 조회 옵션
  allowedIncludes: ['conversation'],
})
@Controller({
  path: 'messages',
  version: '1',
})
export class MessageController {
  constructor(public readonly crudService: MessageService) {}

  /**
   * 특정 대화의 메시지 목록 조회 (테스트용 - 소유권 확인 없음)
   * 실제로는 ?filter=conversationId||$eq||{conversationId} 사용 권장
   */
  @Get('conversation/:conversationId')
  async getConversationMessages(
    @Param('conversationId', ParseIntPipe) conversationId: number,
  ) {
    // 테스트용이므로 소유권 확인 없이 바로 조회
    return await this.crudService.messageRepository.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
    });
  }

  // 기본 CRUD 기능들은 @Crud 데코레이터에 의해 자동 생성됨 (테스트용 - 인증 불필요)
  // GET /api/v1/messages - 전체 메시지 목록 (필터링, 페이지네이션, 정렬 지원)
  // GET /api/v1/messages/:id - 개별 메시지 조회
  // 생성/수정/삭제는 ChatbotService를 통해서만 권장
}
