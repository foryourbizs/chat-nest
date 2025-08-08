import { BeforeCreate, BeforeUpdate, Crud } from '@foryourdev/nestjs-crud';
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  CurrentUser,
  CurrentUserData,
} from 'src/common/decorators/current-user.decorator';
import { AdminGuard } from 'src/guards/admin.guard';
import { Character } from '../../character.entity';
import { CharacterService } from '../../character.service';

@Crud({
  entity: Character,
  allowedFilters: ['name', 'isActive', 'userId', 'usageCount'],
  allowedIncludes: ['user', 'conversations'],
  only: ['index', 'show', 'create', 'update', 'destroy'],
  routes: {
    index: {
      allowedFilters: ['name', 'isActive', 'userId', 'usageCount'],
      allowedIncludes: ['user', 'conversations'],
    },
    show: {
      allowedIncludes: ['user', 'conversations'],
    },
    create: {
      allowedParams: [
        'name',
        'description',
        'avatar',
        'personality',
        'systemPrompt',
        'userId',
      ],
    },
    update: {
      allowedParams: [
        'name',
        'description',
        'avatar',
        'personality',
        'systemPrompt',
        'isActive',
      ],
    },
  },
})
@Controller({
  path: 'admin/characters',
  version: '1',
})
export class AdminCharacterController {
  constructor(public readonly crudService: CharacterService) {}

  @BeforeCreate()
  @BeforeUpdate()
  async validateCharacterData(body: any) {
    // 관리자용 캐릭터 생성/수정시 추가 유효성 검사나 처리 로직
    if (body.systemPrompt && body.systemPrompt.length < 10) {
      throw new Error('시스템 프롬프트는 최소 10자 이상이어야 합니다.');
    }

    return body;
  }

  /**
   * 모든 사용자의 캐릭터 통계 조회 (관리자만)
   */
  @Get('stats')
  @UseGuards(AdminGuard)
  async getCharacterStats(@CurrentUser() currentUser: CurrentUserData) {
    const totalCharacters = await this.crudService.characterRepository.count();
    const activeCharacters = await this.crudService.characterRepository.count({
      where: { isActive: true },
    });
    const totalUsage = await this.crudService.characterRepository
      .createQueryBuilder('character')
      .select('SUM(character.usageCount)', 'totalUsage')
      .getRawOne();

    return {
      totalCharacters,
      activeCharacters,
      inactiveCharacters: totalCharacters - activeCharacters,
      totalUsage: parseInt(totalUsage.totalUsage) || 0,
    };
  }
}
