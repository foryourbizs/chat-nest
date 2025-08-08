import { CrudService } from '@foryourdev/nestjs-crud';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from '../character/character.entity';
import { Conversation } from './conversation.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class ConversationService extends CrudService<Conversation> {
  constructor(
    @InjectRepository(Conversation)
    public conversationRepository: Repository<Conversation>, // 테스트용으로 public 노출
    @InjectRepository(Character)
    private characterRepository: Repository<Character>,
  ) {
    super(conversationRepository);
  }

  /**
   * 새로운 대화 생성 (캐릭터 존재 확인 포함)
   */
  async createConversation(
    userId: number,
    createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    // 캐릭터 존재 확인
    const character = await this.characterRepository.findOne({
      where: { id: createConversationDto.characterId, isActive: true },
    });

    if (!character) {
      throw new NotFoundException('캐릭터를 찾을 수 없습니다.');
    }

    // Repository 직접 사용하여 대화 생성
    const conversation = this.conversationRepository.create({
      ...createConversationDto,
      userId,
    });

    const savedConversation =
      await this.conversationRepository.save(conversation);

    // 관계 정보 포함하여 반환
    const result = await this.conversationRepository.findOne({
      where: { id: savedConversation.id },
      relations: ['character', 'user'],
    });

    if (!result) {
      throw new NotFoundException('생성된 대화를 찾을 수 없습니다.');
    }

    return result;
  }

  // 사용자별 대화 조회는 CRUD 필터링으로 대체됨: GET /conversations (자동 필터링)
  // 대화 상세 조회도 CRUD로 대체됨: GET /conversations/:id?include=messages (자동 소유권 확인)

  /**
   * 대화 제목 자동 생성
   */
  async generateConversationTitle(
    conversationId: number,
    firstMessage: string,
  ): Promise<void> {
    // 첫 메시지를 기반으로 제목 생성 (간단한 로직)
    let title =
      firstMessage.length > 50
        ? firstMessage.substring(0, 47) + '...'
        : firstMessage;

    // 제목이 너무 짧으면 기본 제목 사용
    if (title.trim().length < 5) {
      title = `대화 ${new Date().toLocaleDateString()}`;
    }

    await this.conversationRepository.update(conversationId, { title });
  }

  /**
   * 대화 통계 업데이트
   */
  async updateConversationStats(
    conversationId: number,
    messageCount: number,
    tokenCount: number,
  ): Promise<void> {
    await this.conversationRepository.increment(
      { id: conversationId },
      'messageCount',
      messageCount,
    );

    await this.conversationRepository.increment(
      { id: conversationId },
      'totalTokens',
      tokenCount,
    );

    // updatedAt 갱신
    await this.conversationRepository.update(conversationId, {
      updatedAt: new Date(),
    });
  }

  // 대화 삭제는 CRUD DELETE로 대체됨: DELETE /conversations/:id (자동 소유권 확인)

  // 테스트용이므로 소유권 확인 메서드 제거됨

  /**
   * 캐릭터 정보와 함께 대화 조회 (내부 사용용)
   */
  async findConversationWithCharacter(conversationId: number) {
    return await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['character'],
    });
  }
}
