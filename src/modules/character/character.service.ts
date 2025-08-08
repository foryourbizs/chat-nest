import { CrudService } from '@foryourdev/nestjs-crud';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from './character.entity';

@Injectable()
export class CharacterService extends CrudService<Character> {
  constructor(
    @InjectRepository(Character)
    public characterRepository: Repository<Character>,
  ) {
    super(characterRepository);
  }

  // 모든 CRUD 기능은 @Crud 데코레이터에 의해 자동 생성됨
  // 커스텀 로직 없이 순수 CRUD만 사용

  /**
   * 캐릭터 사용 횟수 증가
   */
  async incrementUsageCount(characterId: number): Promise<void> {
    await this.characterRepository.increment(
      { id: characterId },
      'usageCount',
      1,
    );
  }

  /**
   * 인기 캐릭터 조회 (공개 캐릭터만)
   */
  async findPopularCharacters(limit: number = 10): Promise<Character[]> {
    return await this.characterRepository.find({
      where: { isActive: true },
      order: { usageCount: 'DESC' },
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        avatar: true,
        personality: true,
        usageCount: true,
        createdAt: true,
      },
    });
  }
}
