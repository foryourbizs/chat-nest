import { BeforeCreate, Crud } from '@foryourdev/nestjs-crud';
import { Controller, Logger } from '@nestjs/common';
import { Conversation } from '../../conversation.entity';
import { ConversationService } from '../../conversation.service';

@Crud({
  entity: Conversation,
  // 모든 CRUD 기능 활성화
  only: ['index', 'show', 'create', 'update', 'destroy'],

  // 필터링 옵션
  allowedFilters: ['characterId', 'isActive', 'title'],

  // 생성/수정 시 허용할 파라미터
  allowedParams: [
    'title',
    'characterId',
    'messageCount',
    'totalTokens',
    'isActive',
  ],

  // 관계 조회 옵션
  allowedIncludes: ['character', 'messages'],
})
@Controller({
  path: 'conversations',
  version: '1',
})
export class ConversationController {
  private readonly logger = new Logger(ConversationController.name);

  constructor(public readonly crudService: ConversationService) {}

  @BeforeCreate()
  async beforeCreate(model: Conversation) {
    model.title = 'test';
    model.characterId = 8;

    return model;
  }

  // 모든 CRUD 기능들은 @Crud 데코레이터에 의해 자동 생성됨 (테스트용 - 인증 불필요)
  // GET /api/v1/conversations - 전체 대화 목록 (필터링, 페이지네이션, 정렬 지원)
  // GET /api/v1/conversations/:id - 개별 조회 (?include=messages로 메시지 포함 가능)
  // POST /api/v1/conversations - 생성
  // PUT/PATCH /api/v1/conversations/:id - 수정
  // DELETE /api/v1/conversations/:id - 삭제
}
