<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# NestJS Template

이 프로젝트는 [NestJS](https://nestjs.com/)와 [@foryourdev/nestjs-crud](https://github.com/foryourdev/nestjs-crud)를 사용하여 구축된 **AI 챗봇 플랫폼** RESTful API 템플릿입니다.

## 특징

- 🤖 **2025년 최신 OpenAI 모델**: GPT-5, GPT-4.1, GPT-4o를 지원하는 차세대 AI 챗봇 플랫폼
- 👤 **캐릭터 시스템**: 개성있는 시스템 프롬프트를 통한 캐릭터별 AI 페르소나 구현
- 💬 **초대용량 컨텍스트**: 최대 100개 메시지 맥락을 유지하며 자연스러운 초장문 대화 경험
- 📊 **차세대 AI 관리**: 최신 모델 기반 고품질 대화 요약, 실시간 성능 모니터링, 동적 모델 선택
- 🔌 **완전한 CRUD 지원**: @foryourdev/nestjs-crud를 최대한 활용한 자동 엔드포인트 생성
- 🎯 **고급 쿼리**: 필터링, 페이지네이션, 정렬, 관계 조인을 통한 강력한 데이터 조회
- 🧪 **테스트 친화적**: 인증 없이 모든 API 테스트 가능 (개발/테스트용)
- 🗄️ **TypeORM 통합**: PostgreSQL 데이터베이스와 TypeORM을 사용한 ORM 지원
- 🔍 **쿼리 파싱**: 필터링, 페이지네이션, 정렬, 관계 조인 등 풍부한 쿼리 기능
- ✅ **검증**: class-validator를 사용한 DTO 및 엔티티 검증
- 🔐 **JWT 인증**: JWT 기반 로그인/로그아웃 및 Refresh Token 지원
- 📱 **소셜 로그인**: Google, Apple, Kakao, Naver 소셜 로그인 지원
- 🚀 **Railway PostgreSQL**: Railway 호스팅 PostgreSQL 데이터베이스 연결

## 환경변수 설정

### 필수 환경변수

프로젝트 실행을 위해 다음 환경변수들이 필요합니다:

```bash
# 서버 설정
PORT=3000
NODE_ENV=development

# API 설정
API_VERSION=1
API_PREFIX=api/v

# JWT 설정 (필수)
JWT_SECRET=your-jwt-secret-key-change-this-in-production
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

# 데이터베이스 설정 (필수)
DATABASE_TYPE=postgres
DATABASE_HOST=your-database-host
DATABASE_PORT=5432
DATABASE_USERNAME=your-username
DATABASE_PASSWORD=your-secure-password
DATABASE_NAME=your-database-name
DATABASE_SYNCHRONIZE=false
DATABASE_LOGGING=false

# SSL 설정
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false

# Frontend URL
FRONTEND_URL=http://localhost:3000

# OpenAI API 설정 (AI 챗봇 기능용)
OPEN_API_KEY=sk-your-openai-api-key-here
# OPEN_API_SECRET_KEY는 현재 사용하지 않음 (향후 확장용)

# OpenAI 모델 선택 (선택적)
# OPENAI_MODEL=gpt-5           # 2025년 8월 최신 (실험적)
# OPENAI_MODEL=gpt-4.1         # 2025년 4월 출시
# OPENAI_MODEL=gpt-4o          # 2024년 5월 출시 (기본값, 안정적)
# OPENAI_MODEL=gpt-4-turbo     # 레거시 모델
```

### 소셜 로그인 선택적 설정

소셜 로그인은 선택적으로 사용할 수 있습니다. 필요한 플랫폼의 환경변수만 설정하면 해당 소셜 로그인이 활성화됩니다:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Kakao OAuth
KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CLIENT_SECRET=your-kakao-client-secret
KAKAO_CALLBACK_URL=http://localhost:3000/auth/kakao/callback

# Naver OAuth
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-client-secret
NAVER_CALLBACK_URL=http://localhost:3000/auth/naver/callback

# Apple OAuth
APPLE_CLIENT_ID=your-apple-service-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY=your-apple-private-key
APPLE_CALLBACK_URL=http://localhost:3000/auth/apple/callback
```

### 🤖 OpenAI API 키 획득 방법

AI 챗봇 기능을 사용하려면 OpenAI API 키가 필요합니다:

1. [OpenAI 플랫폼](https://platform.openai.com/)에 가입/로그인
2. 좌측 메뉴에서 "API keys" 클릭
3. "Create new secret key" 버튼 클릭
4. 키 이름을 입력하고 생성
5. 생성된 키를 안전한 곳에 복사 (한 번만 표시됨)
6. `.env` 파일의 `OPEN_API_KEY`에 설정

**⚠️ 주의사항:**

- API 키는 절대 공개하지 마세요
- GitHub 등에 업로드하지 않도록 주의
- 사용량에 따라 비용이 발생할 수 있습니다
- OpenAI 계정에 결제 정보를 등록해야 API를 사용할 수 있습니다

**💰 비용 안내 (2025년 8월 기준):**

- **GPT-5** (최신): $0.02/1K tokens (입력), $0.06/1K tokens (출력) _실험적_
- **GPT-4.1**: $0.015/1K tokens (입력), $0.045/1K tokens (출력)
- **GPT-4o** (기본): $0.005/1K tokens (입력), $0.015/1K tokens (출력) _멀티모달_
- GPT-4-turbo: $0.01/1K tokens (입력), $0.03/1K tokens (출력) _레거시_
- GPT-3.5-turbo: $0.001/1K tokens (입력), $0.002/1K tokens (출력) _경제적_

**🚀 2025년 최신 AI 기술을 활용한 최고 품질:**

- **기본 모델**: GPT-4o (안정적이고 비용 효율적인 멀티모달 모델)
- **실험적 지원**: GPT-5 (2025년 8월 출시, 최고 성능)
- **128K 컨텍스트**: 최대 100개 메시지까지 기억하여 초장문 대화 맥락 유지
- **동적 모델 선택**: 환경변수로 원하는 모델 선택 가능
- **스마트 최적화**: 토큰 효율적 관리로 비용 절약

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env` 파일을 생성하고 위의 환경변수들을 설정하세요.

### 3. 데이터베이스 마이그레이션

```bash
# 마이그레이션 생성
npm run migration:generate -- InitialMigration

# 마이그레이션 실행
npm run migration:run
```

### 4. 개발 서버 실행

```bash
npm run start:dev
```

### 5. 빌드

```bash
npm run build
```

### 6. 프로덕션 실행

```bash
npm run start:prod
```

## API 엔드포인트

### 인증 API

#### 일반 로그인/회원가입

- `POST /api/v1/auth/sign/up` - 회원가입
- `POST /api/v1/auth/sign/in` - 로그인
- `POST /api/v1/auth/sign/refresh` - Access Token 갱신
- `POST /api/v1/auth/sign/out` - 로그아웃

#### 소셜 로그인

- `GET /api/v1/auth/google` - Google 로그인 시작
- `GET /api/v1/auth/google/callback` - Google 로그인 콜백
- `GET /api/v1/auth/kakao` - Kakao 로그인 시작
- `GET /api/v1/auth/kakao/callback` - Kakao 로그인 콜백
- `GET /api/v1/auth/naver` - Naver 로그인 시작
- `GET /api/v1/auth/naver/callback` - Naver 로그인 콜백
- `GET /api/v1/auth/apple` - Apple 로그인 시작
- `GET /api/v1/auth/apple/callback` - Apple 로그인 콜백

### 사용자 API

기본 CRUD 엔드포인트가 자동으로 생성됩니다:

- `GET /api/v1/users` - 모든 사용자 조회 (페이지네이션, 필터링 지원)
- `GET /api/v1/users/:id` - 특정 사용자 조회
- `GET /api/v1/users/me` - 현재 로그인한 사용자 정보 조회 (인증 필요)
- `POST /api/v1/users` - 사용자 생성
- `PUT /api/v1/users/:id` - 사용자 업데이트
- `DELETE /api/v1/users/:id` - 사용자 삭제

### AI 챗봇 API

#### 캐릭터 관리 (완전한 CRUD 지원)

- `GET /api/v1/characters` - 전체 캐릭터 목록 조회 (필터링, 페이지네이션, 정렬 지원)
  - 필터 예시: `?filter=name||$cont||친구&filter=isActive||$eq||true&filter=userId||$eq||1`
  - 정렬 예시: `?sort=usageCount,DESC&sort=createdAt,DESC`
  - 관계 포함: `?include=user,conversations`

- `GET /api/v1/characters/popular` - 인기 캐릭터 목록 조회 (사용량 기준 정렬)
- `GET /api/v1/characters/:id` - 특정 캐릭터 조회
- `POST /api/v1/characters` - 캐릭터 생성 (**인증 불필요, 테스트용**)
- `PUT/PATCH /api/v1/characters/:id` - 캐릭터 수정 (**인증 불필요, 테스트용**)
- `DELETE /api/v1/characters/:id` - 캐릭터 삭제 (**인증 불필요, 테스트용**)

#### 대화 관리 (완전한 CRUD 지원)

- `GET /api/v1/conversations` - 전체 대화 목록 조회 (필터링, 페이지네이션, 정렬 지원)
  - 필터 예시: `?filter=userId||$eq||1&filter=characterId||$eq||123&filter=isActive||$eq||true`
  - 정렬 예시: `?sort=updatedAt,DESC&sort=messageCount,DESC`
  - 관계 포함: `?include=user,character,messages`

- `GET /api/v1/conversations/:id` - 대화 상세 조회 (메시지 포함 가능: `?include=messages`)
- `POST /api/v1/conversations` - 새 대화 생성 (**인증 불필요, 테스트용**)
- `PUT/PATCH /api/v1/conversations/:id` - 대화 수정 (**인증 불필요, 테스트용**)
- `DELETE /api/v1/conversations/:id` - 대화 삭제 (소프트 삭제, **인증 불필요, 테스트용**)

#### 메시지 관리 (CRUD 지원)

- `GET /api/v1/messages` - 전체 메시지 목록 조회 (필터링, 페이지네이션, 정렬 지원)
  - 필터 예시: `?filter=conversationId||$eq||123&filter=role||$eq||user`
  - 정렬 예시: `?sort=createdAt,ASC`
  - 관계 포함: `?include=conversation`
- `GET /api/v1/messages/conversation/:conversationId` - 특정 대화의 메시지 목록 조회 (**소유권 확인 없음, 테스트용**)
- `GET /api/v1/messages/:id` - 특정 메시지 조회

#### AI 챗봇 기능 (OpenAI GPT 기반)

**🤖 2025년 최신 AI**: OpenAI **GPT-4o** (기본) 또는 **GPT-5** (실험적)를 사용하여 차세대 AI 응답을 생성합니다.

- `POST /api/v1/chatbot/send-message` - 메시지 전송 및 **실제 AI 응답** 받기
  ```json
  {
    "content": "안녕하세요! 오늘 기분이 어때요?",
    "conversationId": 1
  }
  ```
- `GET /api/v1/chatbot/conversations/:conversationId/summary` - **AI 기반 대화 요약** 생성
- `GET /api/v1/chatbot/stats` - 전체 시스템 통계 및 토큰 사용량 정보

**📊 관리자 전용 API**:

- `GET /api/v1/admin/chatbot/system-stats` - 시스템 전체 AI 사용 통계
- `GET /api/v1/admin/chatbot/ai-performance` - AI 모델 성능 및 토큰 사용량 모니터링
- `GET /api/v1/admin/chatbot/token-usage` - OpenAI 토큰 사용량 및 비용 추정
- `POST /api/v1/admin/chatbot/send-message` - 관리자 권한으로 메시지 전송

**⚡ 2025년 차세대 AI 기능**:

- **초대용량 컨텍스트**: 최대 100개 메시지 (200K 토큰) 까지 기억 가능
- **동적 모델 선택**: 환경변수로 GPT-5, GPT-4.1, GPT-4o 중 선택
- **스마트 컨텍스트 최적화**: AI가 최적의 메시지 선택으로 토큰 효율 극대화
- **멀티모달 지원**: GPT-4o의 텍스트+이미지 처리 능력 (향후 확장)
- **전문가급 AI 요약**: 최대 100개 메시지를 분석한 고품질 대화 요약
- **실시간 성능 모니터링**: 토큰 사용량, 응답 시간, 모델 성능 추적
- **고급 에러 핸들링**: API 한도, Rate limit, 모델 호환성 자동 처리

## 프로젝트 구조

```
src/
├── common/               # 공통 유틸리티
│   ├── constants/        # 상수
│   ├── decorators/       # 데코레이터
│   └── interceptors/     # 인터셉터
├── config/               # 설정 파일
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── openai.config.ts
├── guards/               # 가드
│   ├── admin.guard.ts
│   ├── auth.guard.ts
│   └── dev-only.guard.ts
├── migrations/           # 데이터베이스 마이그레이션
├── modules/              # 모듈
│   ├── app.module.ts     # 루트 모듈
│   ├── auth/             # 인증 모듈
│   ├── chatbot/          # AI 챗봇 모듈 (완전한 CRUD 지원)
│   │   ├── entities/     # 엔티티 (Character, Conversation, Message)
│   │   ├── services/     # 서비스 (Character, Conversation, Message, Chatbot)
│   │   ├── controllers/  # 컨트롤러 (Character, Conversation, Message, Chatbot)
│   │   ├── dto/          # 데이터 전송 객체
│   │   ├── interceptors/ # 인터셉터 (사용자 ID 자동 설정)
│   │   ├── *.module.ts   # 서브 모듈들
│   │   └── index.ts      # 통합 내보내기
│   ├── schema/           # 스키마 모듈 (개발용)
│   └── users/            # 사용자 모듈
└── main.ts               # 진입점
```

## 마이그레이션

이 템플릿은 TypeORM 마이그레이션을 사용합니다:

```bash
# 새 마이그레이션 생성
npm run migration:generate -- MigrationName

# 마이그레이션 실행
npm run migration:run

# 마이그레이션 되돌리기
npm run migration:revert
```

## 개발 도구

### 스키마 모듈 (개발 환경에서만)

개발 환경에서는 스키마 모듈이 자동으로 활성화되어 데이터베이스 구조와 CRUD 메타데이터를 확인할 수 있습니다:

- `GET /schema` - 데이터베이스 스키마 조회
- CRUD 엔드포인트의 메타데이터 및 검증 규칙 확인

## 보안 고려사항

- 프로덕션에서는 `DATABASE_SYNCHRONIZE=false`로 설정
- JWT_SECRET은 반드시 강력한 키로 변경
- 환경변수 파일(.env)을 git에 커밋하지 않도록 주의
- CORS 설정 확인
- 소셜 로그인 콜백 URL의 HTTPS 사용 권장

## 참고 자료

- [NestJS Documentation](https://docs.nestjs.com/)
- [@foryourdev/nestjs-crud Documentation](https://github.com/foryourdev/nestjs-crud)
- [TypeORM Documentation](https://typeorm.io/)
- [Railway PostgreSQL Documentation](https://docs.railway.app/databases/postgresql)

## 💡 CRUD 중심 API 사용 가이드 (테스트용 - 인증 불필요)

이 프로젝트는 **완전한 CRUD 자동화**를 달성했습니다. **테스트용으로 인증이 제거되어** 모든 API를 자유롭게 테스트할 수 있습니다!

### 📝 기본 사용법 (인증 없음)

```bash
# 🧪 테스트용으로 Authorization 헤더 불필요!

# 📋 전체 캐릭터 목록
GET /api/v1/characters

# 🎯 특정 사용자의 캐릭터만 필터링
GET /api/v1/characters?filter=userId||$eq||1&filter=name||$cont||친구

# 📊 관계 데이터 포함
GET /api/v1/conversations?include=character,messages&sort=updatedAt,DESC

# ✨ 새 리소스 생성 (userId를 직접 지정)
POST /api/v1/characters
Content-Type: application/json
{
  "name": "친구 AI",
  "description": "친근한 대화 상대",
  "systemPrompt": "너는 친근한 친구처럼 대화하는 AI야",
  "userId": 1
}

# 🔄 리소스 수정 (소유권 확인 없음)
PATCH /api/v1/characters/123
{
  "name": "업데이트된 AI"
}

# 🗑️ 리소스 삭제 (소유권 확인 없음)
DELETE /api/v1/characters/123
```

### 🎨 고급 쿼리 패턴

```bash
# 📊 복합 필터링
GET /api/v1/conversations?filter=characterId||$eq||123&filter=isActive||$eq||true&filter=messageCount||$gt||5

# 🔍 텍스트 검색
GET /api/v1/characters?filter=name||$cont||AI&filter=description||$cont||친구

# 📈 정렬 조합
GET /api/v1/conversations?sort=messageCount,DESC&sort=updatedAt,DESC

# 📄 페이지네이션
GET /api/v1/characters?limit=10&offset=20

# 🔗 관계 데이터와 함께
GET /api/v1/conversations/123?include=character,messages

# 👤 특정 사용자 데이터 필터링
GET /api/v1/conversations?filter=userId||$eq||1&include=character
```

### 🚀 실제 사용 시나리오

```bash
# 시나리오 1: 새 AI 캐릭터 만들고 대화 시작 (테스트용)
# 1. 캐릭터 생성
POST /api/v1/characters { "name": "학습 도우미", "systemPrompt": "...", "userId": 1 }

# 2. 대화 생성
POST /api/v1/conversations { "characterId": 456, "title": "수학 공부", "userId": 1 }

# 3. 메시지 전송 및 AI 응답 (고정 사용자 ID 사용)
POST /api/v1/chatbot/send-message { "conversationId": 789, "content": "안녕!" }

# 시나리오 2: 기존 대화 이어가기 (테스트용)
# 1. 특정 사용자의 대화 목록 확인
GET /api/v1/conversations?filter=userId||$eq||1&sort=updatedAt,DESC&limit=5

# 2. 특정 대화 메시지들 확인 (소유권 확인 없음)
GET /api/v1/messages?filter=conversationId||$eq||789&sort=createdAt,ASC

# 3. 메시지 전송 (고정 사용자 ID 사용)
POST /api/v1/chatbot/send-message { "conversationId": 789, "content": "계속 이야기해줘" }
```

### ⚡ 핵심 기능 (테스트용)

- **🧪 인증 불필요**: 모든 API를 인증 없이 자유롭게 테스트 가능
- **🎯 표준 REST**: 일관된 API 패턴으로 학습 비용 최소화
- **📊 강력한 쿼리**: 필터링, 정렬, 관계 조회를 조합한 복잡한 쿼리 지원
- **🔍 유연한 필터링**: userId 등을 통해 원하는 데이터만 조회 가능
- **⚡ 빠른 프로토타이핑**: 권한 체크 없이 빠르게 API 동작 확인
