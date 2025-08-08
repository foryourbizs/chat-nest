import { CrudService } from '@foryourdev/nestjs-crud';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './conversation.entity';

@Injectable()
export class ConversationService extends CrudService<Conversation> {
  constructor(
    @InjectRepository(Conversation)
    public conversationRepository: Repository<Conversation>, // 테스트용으로 public 노출
  ) {
    super(conversationRepository);
  }

  // 모든 CRUD 기능은 @Crud 데코레이터에 의해 자동 생성됨
  // 커스텀 로직 없이 순수 CRUD만 사용

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
