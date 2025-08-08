import { Crud } from '@foryourdev/nestjs-crud';
import { Controller } from '@nestjs/common';
import { Conversation } from '../../conversation.entity';
import { ConversationService } from '../../conversation.service';

@Crud({
  entity: Conversation,
  // 모든 CRUD 기능 활성화
  only: ['index', 'show', 'create', 'update', 'destroy'],

  // 필터링 옵션
  allowedFilters: ['characterId', 'isActive', 'userId', 'title'],

  // 정렬은 쿼리 파라미터로 지원 (?sort=field,order)

  // 관계 조회 옵션
  allowedIncludes: ['user', 'character', 'messages'],

  // 라우트 설정 - 테스트용으로 인증 불필요
})
@Controller({
  path: 'conversations',
  version: '1',
})
export class ConversationController {
  constructor(public readonly crudService: ConversationService) {}

  // 모든 CRUD 기능들은 @Crud 데코레이터에 의해 자동 생성됨 (테스트용 - 인증 불필요)
  // GET /api/v1/conversations - 전체 대화 목록 (필터링, 페이지네이션, 정렬 지원)
  // GET /api/v1/conversations/:id - 개별 조회 (?include=messages로 메시지 포함 가능)
  // POST /api/v1/conversations - 생성
  // PUT/PATCH /api/v1/conversations/:id - 수정
  // DELETE /api/v1/conversations/:id - 삭제
}
