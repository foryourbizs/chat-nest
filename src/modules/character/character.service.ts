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

  // 사용자별 캐릭터 조회는 CRUD 필터링으로 대체됨: GET /characters (자동 필터링)
  // 캐릭터 상세 조회도 CRUD로 대체됨: GET /characters/:id (자동 소유권 확인)

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
      relations: ['user'],
      select: {
        id: true,
        name: true,
        description: true,
        avatar: true,
        personality: true,
        usageCount: true,
        createdAt: true,
        user: {
          id: true,
          name: true,
        },
      },
    });
  }
}
