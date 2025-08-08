import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
  DEFAULT_OPENAI_CONFIG,
  OpenAIConfig,
  getSelectedModel,
} from 'src/config/openai.config';
import { CharacterService } from '../../character/character.service';
import { ConversationService } from '../../conversation/conversation.service';
import { Message, MessageRole } from '../../message/message.entity';
import { MessageService } from '../../message/message.service';
import { SendMessageDto } from '../dto/send-message.dto';

interface ChatResponse {
  content: string;
  tokenCount: number;
  model: string;
  finishReason?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  private readonly openai: OpenAI;
  private readonly selectedModel: string;

  constructor(
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
    private readonly characterService: CharacterService,
    private readonly configService: ConfigService,
  ) {
    // OpenAI 클라이언트 초기화
    this.openai = OpenAIConfig.getInstance(configService);
    // 환경변수 또는 기본값으로 모델 선택
    this.selectedModel = getSelectedModel(configService);
    this.logger.log(
      `🤖 OpenAI 클라이언트가 초기화되었습니다. 사용 모델: ${this.selectedModel}`,
    );
  }

  /**
   * 사용자 메시지 전송 및 AI 응답 생성
   */
  async sendMessage(
    userId: number,
    sendMessageDto: SendMessageDto,
  ): Promise<{
    userMessage: Message;
    assistantMessage: Message;
  }> {
    const { content, conversationId } = sendMessageDto;

    try {
      // 대화 존재 확인 (테스트용 - 소유권 확인 간소화)
      const conversation =
        await this.conversationService.conversationRepository.findOne({
          where: { id: conversationId, isActive: true },
        });

      if (!conversation) {
        throw new BadRequestException('대화를 찾을 수 없습니다.');
      }

      // 사용자 메시지 저장
      const userMessage = await this.messageService.createMessage({
        content,
        role: MessageRole.USER,
        conversationId,
        tokenCount: this.estimateTokenCount(content),
      });

      // 대화 컨텍스트 구성
      const { systemPrompt, messages } =
        await this.messageService.buildConversationContext(
          conversationId,
          userId,
        );

      // AI 응답 생성
      const aiResponse = await this.generateOpenAIResponse(
        systemPrompt,
        messages,
        content,
      );

      // AI 응답 메시지 저장
      const assistantMessage = await this.messageService.createMessage({
        content: aiResponse.content,
        role: MessageRole.ASSISTANT,
        conversationId,
        tokenCount: aiResponse.tokenCount,
        metadata: {
          model: aiResponse.model,
          timestamp: new Date().toISOString(),
        },
      });

      // 캐릭터 사용 횟수 증가
      const conversationWithCharacter =
        await this.conversationService.findConversationWithCharacter(
          conversationId,
        );
      if (conversationWithCharacter?.character) {
        await this.characterService.incrementUsageCount(
          conversationWithCharacter.character.id,
        );
      }

      this.logger.log(
        `AI response generated for conversation ${conversationId}, user ${userId}`,
      );

      return {
        userMessage,
        assistantMessage,
      };
    } catch (error) {
      this.logger.error(
        `Failed to send message for conversation ${conversationId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * OpenAI API를 사용한 실제 AI 응답 생성
   */
  private async generateOpenAIResponse(
    systemPrompt: string,
    messages: Message[],
    newUserMessage: string,
  ): Promise<ChatResponse> {
    try {
      // 컨텍스트 최적화: GPT-4 Turbo의 128K 컨텍스트 윈도우를 최대한 활용
      const maxContextMessages = DEFAULT_OPENAI_CONFIG.maxContextMessages;
      const contextMessages = await this.optimizeContextMessages(
        messages,
        maxContextMessages,
      );

      // 메시지 히스토리를 OpenAI Chat Completion 형식으로 변환
      const chatMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
        [
          {
            role: 'system',
            content: systemPrompt,
          },
          // 최적화된 컨텍스트 메시지들 추가
          ...contextMessages.map((msg) => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
          })),
          // 새로운 사용자 메시지 추가
          {
            role: 'user',
            content: newUserMessage,
          },
        ];

      this.logger.debug(
        `OpenAI API 호출 시작 - 모델: ${this.selectedModel}, 메시지: ${chatMessages.length}개`,
      );

      // OpenAI API 호출 (동적 모델 선택)
      const response = await this.openai.chat.completions.create({
        model: this.selectedModel,
        messages: chatMessages,
        max_tokens: DEFAULT_OPENAI_CONFIG.maxTokens,
        temperature: DEFAULT_OPENAI_CONFIG.temperature,
        top_p: DEFAULT_OPENAI_CONFIG.topP,
        frequency_penalty: DEFAULT_OPENAI_CONFIG.frequencyPenalty,
        presence_penalty: DEFAULT_OPENAI_CONFIG.presencePenalty,
      });

      const choice = response.choices[0];
      const content = choice.message?.content || '';

      if (!content) {
        throw new Error('OpenAI 응답이 비어있습니다');
      }

      this.logger.debug(
        `OpenAI API 응답 성공 - 토큰: ${response.usage?.total_tokens || 0}`,
      );

      return {
        content,
        tokenCount:
          response.usage?.total_tokens || this.estimateTokenCount(content),
        model: response.model,
        finishReason: choice.finish_reason || undefined,
        usage: response.usage
          ? {
              promptTokens: response.usage.prompt_tokens,
              completionTokens: response.usage.completion_tokens,
              totalTokens: response.usage.total_tokens,
            }
          : undefined,
      };
    } catch (error) {
      this.logger.error('OpenAI API 호출 실패', error);

      // OpenAI API 에러 상세 처리
      if (error?.error?.code === 'insufficient_quota') {
        throw new BadRequestException(
          'OpenAI API 사용량을 초과했습니다. 관리자에게 문의해주세요.',
        );
      } else if (error?.error?.code === 'invalid_api_key') {
        throw new BadRequestException('OpenAI API 키가 유효하지 않습니다.');
      } else if (error?.error?.code === 'rate_limit_exceeded') {
        throw new BadRequestException(
          '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
        );
      }

      throw new BadRequestException(
        'AI 응답 생성에 실패했습니다. 다시 시도해주세요.',
      );
    }
  }

  /**
   * 컨텍스트 메시지 최적화 - GPT-4 Turbo의 대용량 컨텍스트 윈도우 활용
   */
  private async optimizeContextMessages(
    messages: Message[],
    maxMessages: number,
  ): Promise<Message[]> {
    if (messages.length <= maxMessages) {
      return messages; // 메시지가 적으면 모두 포함
    }

    // 스마트 컨텍스트 선택 전략:
    // 1. 최근 메시지들을 우선순위로 선택
    // 2. 토큰 수를 고려하여 조정
    // 3. 대화의 연속성을 유지

    const recentMessages = messages.slice(-maxMessages);

    // 토큰 수 계산하여 128K 컨텍스트 윈도우 내에서 최적화 (GPT-4o 기준)
    let totalTokens = 0;
    const maxContextTokens = 120000; // 128K에서 여유분 확보 (GPT-4o/GPT-5 공통)
    const optimizedMessages: Message[] = [];

    // 최근 메시지부터 역순으로 추가
    for (let i = recentMessages.length - 1; i >= 0; i--) {
      const message = recentMessages[i];
      const messageTokens = this.estimateTokenCount(message.content);

      if (totalTokens + messageTokens <= maxContextTokens) {
        optimizedMessages.unshift(message); // 앞에 추가하여 순서 유지
        totalTokens += messageTokens;
      } else {
        // 토큰 한도에 도달하면 중단
        this.logger.debug(
          `컨텍스트 토큰 한도 도달: ${totalTokens}/${maxContextTokens} 토큰, ${optimizedMessages.length}개 메시지 사용`,
        );
        break;
      }
    }

    this.logger.debug(
      `컨텍스트 최적화 완료: 전체 ${messages.length}개 중 ${optimizedMessages.length}개 메시지 선택 (${totalTokens} 토큰)`,
    );

    return optimizedMessages;
  }

  /**
   * OpenAI API를 사용한 대화 요약 생성
   */
  async generateConversationSummary(conversationId: number): Promise<string> {
    try {
      const messages =
        await this.messageService.findConversationMessages(conversationId);

      if (messages.length === 0) {
        return '대화가 없습니다.';
      }

      // GPT-4 Turbo의 대용량 컨텍스트를 활용하여 더 많은 메시지 포함
      const maxSummaryMessages = 100; // 요약에 최대 100개 메시지 포함
      const summaryMessages = messages.slice(-maxSummaryMessages);

      // 컨텍스트가 매우 긴 경우 토큰 수 체크
      const conversationText = summaryMessages
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join('\n');

      const totalTokens = this.estimateTokenCount(conversationText);
      this.logger.debug(
        `대화 요약 생성: ${summaryMessages.length}개 메시지, 약 ${totalTokens} 토큰`,
      );

      const response = await this.openai.chat.completions.create({
        model: this.selectedModel, // 선택된 최신 모델로 고품질 요약
        messages: [
          {
            role: 'system',
            content: `다음 대화를 한국어로 상세하게 요약해주세요. 
주요 주제, 핵심 내용, 대화의 흐름, 중요한 결론을 포함하여 
5-8문장 정도로 포괄적인 요약을 작성해주세요.
대화 참여자들의 감정이나 의도도 파악할 수 있다면 포함해주세요.`,
          },
          {
            role: 'user',
            content: conversationText,
          },
        ],
        max_tokens: 800, // GPT-4 Turbo로 더 상세한 요약 생성
        temperature: 0.3, // 요약은 일관성 있게
      });

      return (
        response.choices[0]?.message?.content || '요약을 생성할 수 없습니다.'
      );
    } catch (error) {
      this.logger.error('대화 요약 생성 실패', error);
      return '요약을 생성할 수 없습니다.';
    }
  }

  /**
   * 토큰 수 추정 (OpenAI 토큰 계산 근사치)
   */
  private estimateTokenCount(text: string): number {
    // OpenAI의 토큰 계산 근사치
    // - 영어: 대략 4글자 = 1토큰
    // - 한국어: 대략 2-3글자 = 1토큰 (한글은 더 효율적)

    // 한글과 영어를 구분하여 계산
    const koreanChars = (text.match(/[가-힣]/g) || []).length;
    const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
    const otherChars = text.length - koreanChars - englishChars;

    // 한글: 2.5글자당 1토큰, 영어: 4글자당 1토큰, 기타: 3글자당 1토큰
    const koreanTokens = Math.ceil(koreanChars / 2.5);
    const englishTokens = Math.ceil(englishChars / 4);
    const otherTokens = Math.ceil(otherChars / 3);

    return koreanTokens + englishTokens + otherTokens;
  }

  /**
   * 대화 요약 생성 (테스트용 - 소유권 확인 없음)
   */
  async getConversationSummary(
    conversationId: number,
    userId?: number, // 테스트용으로 선택적
  ): Promise<{ summary: string }> {
    try {
      const summary = await this.generateConversationSummary(conversationId);
      return { summary };
    } catch (error) {
      this.logger.error('Failed to generate conversation summary', error);
      return { summary: '요약을 생성할 수 없습니다.' };
    }
  }

  /**
   * 사용자 메시지 통계 (테스트용 - 간단한 구현)
   */
  async getUserMessageStats(userId: number) {
    try {
      // 테스트용 간단한 통계 (실제로는 더 복잡한 쿼리 필요)
      const totalMessages = await this.messageService.messageRepository.count({
        where: { role: MessageRole.USER },
      });

      const totalConversations =
        await this.conversationService.conversationRepository.count({
          where: { isActive: true },
        });

      return {
        totalMessages,
        totalConversations,
        averageMessagesPerConversation:
          totalConversations > 0
            ? Math.round(totalMessages / totalConversations)
            : 0,
        note: '테스트용 통계 - 모든 사용자 데이터 포함',
      };
    } catch (error) {
      this.logger.error('Failed to get user message stats', error);
      return {
        totalMessages: 0,
        totalConversations: 0,
        averageMessagesPerConversation: 0,
        error: '통계를 가져올 수 없습니다.',
      };
    }
  }
}
