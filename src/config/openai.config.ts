import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ENV_KEYS } from 'src/common/constants/app.constants';

/**
 * OpenAI 설정 및 클라이언트 생성
 */
export class OpenAIConfig {
  private static _instance: OpenAI;
  private static _configService: ConfigService;

  /**
   * OpenAI 클라이언트 인스턴스 반환 (싱글톤)
   */
  static getInstance(configService?: ConfigService): OpenAI {
    if (!this._instance) {
      if (!configService) {
        throw new Error('ConfigService is required for OpenAI initialization');
      }
      this._configService = configService;
      this._instance = this.createClient();
    }
    return this._instance;
  }

  /**
   * OpenAI 클라이언트 생성
   */
  private static createClient(): OpenAI {
    const apiKey = this._configService.get<string>(ENV_KEYS.OPEN_API_KEY);

    if (!apiKey) {
      throw new Error('OPEN_API_KEY is required but not provided');
    }

    return new OpenAI({
      apiKey: apiKey,
      // Optional: organization key를 사용하는 경우
      // organization: this._configService.get<string>(ENV_KEYS.OPEN_API_SECRET_KEY),
    });
  }

  /**
   * 환경변수 검증
   */
  static validateConfig(configService: ConfigService): void {
    const apiKey = configService.get<string>(ENV_KEYS.OPEN_API_KEY);

    if (!apiKey) {
      throw new Error(
        `Missing required environment variable: ${ENV_KEYS.OPEN_API_KEY}`,
      );
    }

    if (apiKey.length < 20) {
      throw new Error('OPEN_API_KEY appears to be invalid (too short)');
    }

    if (!apiKey.startsWith('sk-')) {
      console.warn('Warning: OPEN_API_KEY should start with "sk-"');
    }

    console.log('✅ OpenAI configuration validated successfully');
  }
}

/**
 * OpenAI 모델 설정 - 2025년 8월 기준 최신 모델들
 */
export const OPENAI_MODELS = {
  // 2025년 최신 모델들
  GPT_5: 'gpt-5', // 2025년 8월 출시 최신 모델
  GPT_4_1: 'gpt-4.1', // 2025년 4월 출시
  GPT_4O: 'gpt-4o', // 2024년 5월 출시 (멀티모달)

  // 기존 GPT-4 모델들
  GPT_4_TURBO: 'gpt-4-turbo', // 레거시 모델
  GPT_4: 'gpt-4',
  GPT_4_32K: 'gpt-4-32k',

  // GPT-3.5 모델들 (경제적 옵션)
  GPT_3_5_TURBO: 'gpt-3.5-turbo',
  GPT_3_5_TURBO_16K: 'gpt-3.5-turbo-16k',
} as const;

/**
 * OpenAI 토큰 및 비용 정보 - 2025년 8월 기준
 */
export const OPENAI_PRICING = {
  // 2025년 최신 모델들 (예상 비용)
  [OPENAI_MODELS.GPT_5]: {
    input: 0.02, // GPT-5 예상 비용 (프리미엄 모델)
    output: 0.06,
    maxTokens: 200000, // 예상 컨텍스트 윈도우
  },
  [OPENAI_MODELS.GPT_4_1]: {
    input: 0.015, // GPT-4.1 예상 비용
    output: 0.045,
    maxTokens: 150000,
  },
  [OPENAI_MODELS.GPT_4O]: {
    input: 0.005, // GPT-4o (멀티모달, 효율적)
    output: 0.015,
    maxTokens: 128000,
  },

  // 기존 모델들
  [OPENAI_MODELS.GPT_4_TURBO]: {
    input: 0.01,
    output: 0.03,
    maxTokens: 128000,
  },
  [OPENAI_MODELS.GPT_4]: {
    input: 0.03,
    output: 0.06,
    maxTokens: 8192,
  },
  [OPENAI_MODELS.GPT_3_5_TURBO]: {
    input: 0.001,
    output: 0.002,
    maxTokens: 4096,
  },
} as const;

/**
 * 기본 OpenAI 설정 - 2025년 최신 GPT-4o 기반 고품질 설정
 */
export const DEFAULT_OPENAI_CONFIG = {
  model: OPENAI_MODELS.GPT_4O, // GPT-4o (2024년 출시, 멀티모달, 안정적)
  maxTokens: 8000, // 응답 최대 토큰 수 (더 긴 응답 가능)
  temperature: 0.7, // 창의성 조절 (0-2)
  topP: 1, // 다양성 조절 (0-1)
  frequencyPenalty: 0, // 반복 방지 (-2 to 2)
  presencePenalty: 0, // 새로운 주제 장려 (-2 to 2)
  maxContextMessages: 100, // GPT-4o의 128K 컨텍스트를 최대한 활용
} as const;

/**
 * 실험적 최신 모델 설정 - GPT-5 (2025년 8월 출시)
 * 실제 사용 전에 API 키로 모델 사용 가능 여부 확인 필요
 */
export const EXPERIMENTAL_OPENAI_CONFIG = {
  model: OPENAI_MODELS.GPT_5, // 최신 GPT-5 모델
  maxTokens: 10000, // 더 긴 응답 가능
  temperature: 0.7,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
  maxContextMessages: 150, // GPT-5의 대용량 컨텍스트 활용
} as const;

/**
 * 환경변수로 모델 선택 기능
 */
export const getSelectedModel = (configService: ConfigService): string => {
  const selectedModel = configService.get<string>(ENV_KEYS.OPENAI_MODEL);

  // 환경변수로 모델이 지정된 경우
  if (selectedModel) {
    console.log(`🤖 OpenAI 모델 선택됨: ${selectedModel}`);
    return selectedModel;
  }

  // 기본값: GPT-4o (안정적)
  console.log(`🤖 OpenAI 기본 모델 사용: ${DEFAULT_OPENAI_CONFIG.model}`);
  return DEFAULT_OPENAI_CONFIG.model;
};
