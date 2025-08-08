import { Crud } from '@foryourdev/nestjs-crud';
import { Controller, Get } from '@nestjs/common';
import { Character } from '../../character.entity';
import { CharacterService } from '../../character.service';

@Crud({
  entity: Character,
  allowedFilters: ['name', 'isActive', 'usageCount'],
  allowedParams: [
    'name',
    'description',
    'avatar',
    'personality',
    'systemPrompt',
    'isActive',
    'usageCount',
  ],
  allowedIncludes: ['conversations'],
  only: ['index', 'show', 'create', 'update', 'destroy'], // 순수 CRUD 데코레이터 사용
})
@Controller({
  path: 'characters',
  version: '1',
})
export class CharacterController {
  constructor(public readonly crudService: CharacterService) {}

  /**
   * 인기 캐릭터 목록 조회 (사용량 기준 정렬)
   */
  @Get('popular')
  async getPopularCharacters() {
    return await this.crudService.findPopularCharacters(10);
  }

  // 모든 CRUD 기능들은 @Crud 데코레이터에 의해 자동 생성됨 (테스트용 - 인증 불필요)
  // GET /api/v1/characters - 전체 캐릭터 목록 (필터링, 페이지네이션, 정렬 지원)
  // GET /api/v1/characters/:id - 개별 조회
  // POST /api/v1/characters - 생성
  // PUT/PATCH /api/v1/characters/:id - 수정
  // DELETE /api/v1/characters/:id - 삭제
}
