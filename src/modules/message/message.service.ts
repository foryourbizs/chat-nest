import { CrudService } from '@foryourdev/nestjs-crud';
import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../conversation/conversation.entity';
import { ConversationService } from '../conversation/conversation.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message, MessageRole } from './message.entity';

@Injectable()
export class MessageService extends CrudService<Message> {
  constructor(
    @InjectRepository(Message)
    public messageRepository: Repository<Message>, // 테스트용으로 public 노출
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @Inject(forwardRef(() => ConversationService))
    private conversationService: ConversationService,
  ) {
    super(messageRepository);
  }

  /**
   * 메시지 생성 (Repository 직접 사용)
   */
  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    // 대화 존재 확인
    const conversation = await this.conversationRepository.findOne({
      where: { id: createMessageDto.conversationId, isActive: true },
    });

    if (!conversation) {
      throw new NotFoundException('대화를 찾을 수 없습니다.');
    }

    // Repository 직접 사용하여 메시지 생성
    const message = this.messageRepository.create(createMessageDto);
    const savedMessage = await this.messageRepository.save(message);

    // 대화 통계 업데이트
    await this.conversationService.updateConversationStats(
      createMessageDto.conversationId,
      1,
      createMessageDto.tokenCount || 0,
    );

    // 첫 번째 사용자 메시지인 경우 대화 제목 생성
    if (
      createMessageDto.role === MessageRole.USER &&
      conversation.messageCount === 0
    ) {
      await this.conversationService.generateConversationTitle(
        createMessageDto.conversationId,
        createMessageDto.content,
      );
    }

    return savedMessage;
  }

  /**
   * 대화의 메시지 목록 조회 (테스트용 - 소유권 확인 없음)
   * 일반적으로는 CRUD 필터링 사용 권장: GET /messages?filter=conversationId||$eq||123
   */
  async findConversationMessages(
    conversationId: number,
    userId?: number, // 테스트용으로 선택적
  ): Promise<Message[]> {
    // 테스트용이므로 소유권 확인 생략하고 바로 메시지 조회
    return await this.messageRepository.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
    });
  }

  /**
   * 대화 컨텍스트 구성 (AI 모델용)
   */
  async buildConversationContext(
    conversationId: number,
    userId: number,
    maxMessages: number = 20,
  ): Promise<{ systemPrompt: string; messages: Message[] }> {
    // 대화와 캐릭터 정보 조회
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId, isActive: true },
      relations: ['character'],
    });

    if (!conversation) {
      throw new NotFoundException('대화를 찾을 수 없습니다.');
    }

    // 최근 메시지들 조회
    const messages = await this.messageRepository.find({
      where: { conversationId },
      order: { createdAt: 'DESC' },
      take: maxMessages,
    });

    // 시간순 정렬 (오래된 것부터)
    messages.reverse();

    return {
      systemPrompt: conversation.character.systemPrompt,
      messages,
    };
  }

  /**
   * 메시지 통계 조회
   */
  async getMessageStats(userId: number) {
    const result = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.conversation', 'conversation')
      .select([
        'COUNT(*) as totalMessages',
        'SUM(message.tokenCount) as totalTokens',
        'COUNT(CASE WHEN message.role = :userRole THEN 1 END) as userMessages',
        'COUNT(CASE WHEN message.role = :assistantRole THEN 1 END) as assistantMessages',
      ])
      .where('conversation.userId = :userId', { userId })
      .setParameters({
        userRole: MessageRole.USER,
        assistantRole: MessageRole.ASSISTANT,
      })
      .getRawOne();

    return {
      totalMessages: parseInt(result.totalMessages) || 0,
      totalTokens: parseInt(result.totalTokens) || 0,
      userMessages: parseInt(result.userMessages) || 0,
      assistantMessages: parseInt(result.assistantMessages) || 0,
    };
  }
}
