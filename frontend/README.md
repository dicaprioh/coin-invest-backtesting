# 코인 투자 백테스팅 플랫폼 - Frontend

## 개요

이 프로젝트는 암호화폐 투자 전략의 백테스팅을 위한 현대적이고 안전한 웹 프론트엔드입니다. React 18, TypeScript, Material-UI를 기반으로 구축되었으며, 보안성, 안정성, 사용자 편의성, 실현가능성, UI/UX 향상에 중점을 두고 설계되었습니다.

## 주요 특징

### 🔐 보안성
- **Multi-factor Authentication (MFA)**: Auth0를 통한 강력한 인증 시스템
- **Content Security Policy (CSP)**: XSS 공격 방지
- **HTTPS 강제**: 모든 통신 암호화
- **JWT 토큰 관리**: 자동 갱신 및 안전한 저장
- **입력 검증**: 모든 사용자 입력에 대한 엄격한 검증

### 🛡️ 안정성
- **Error Boundary**: 예상치 못한 오류 처리
- **Redux Toolkit**: 예측 가능한 상태 관리
- **TypeScript**: 타입 안전성 보장
- **테스트 커버리지**: 90% 이상 목표
- **Progressive Web App**: 오프라인 기능 지원

### 👥 사용자 편의성
- **반응형 디자인**: 모든 디바이스에서 최적화
- **다국어 지원**: 한국어, 영어, 일본어, 중국어
- **접근성**: WCAG 2.1 AA 준수
- **다크/라이트 모드**: 사용자 선호도 반영
- **직관적인 네비게이션**: 사용자 친화적 인터페이스

### ⚡ 성능 최적화
- **코드 스플리팅**: 필요한 컴포넌트만 로드
- **가상화**: 대용량 데이터 효율적 렌더링
- **CDN 통합**: 전 세계 빠른 로딩
- **이미지 최적화**: WebP 포맷 지원
- **캐싱 전략**: 효율적인 데이터 관리

## 기술 스택

### Core Technologies
- **React 18**: 최신 React 기능 활용
- **TypeScript**: 타입 안전성 및 개발 생산성
- **Vite**: 빠른 개발 환경
- **Material-UI v5**: 일관된 디자인 시스템

### State Management
- **Redux Toolkit**: 현대적인 상태 관리
- **RTK Query**: 효율적인 데이터 페칭
- **React Query**: 서버 상태 관리

### Styling & UI
- **Emotion**: CSS-in-JS 솔루션
- **Material-UI**: 컴포넌트 라이브러리
- **Recharts**: 데이터 시각화
- **D3.js**: 고급 차트 기능

### Development Tools
- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅
- **Husky**: Git hooks 관리
- **Jest**: 단위 테스트
- **Cypress**: E2E 테스트

## 프로젝트 구조

```
frontend/
├── public/                 # 정적 파일
├── src/
│   ├── components/        # 재사용 가능한 컴포넌트
│   │   ├── Layout/       # 레이아웃 컴포넌트
│   │   ├── Auth/         # 인증 관련 컴포넌트
│   │   ├── Charts/       # 차트 컴포넌트
│   │   └── Common/       # 공통 컴포넌트
│   ├── pages/            # 페이지 컴포넌트
│   │   ├── Dashboard/    # 대시보드
│   │   ├── Portfolio/    # 포트폴리오 관리
│   │   ├── Backtesting/  # 백테스팅
│   │   ├── Markets/      # 마켓 데이터
│   │   ├── Strategy/     # 전략 관리
│   │   └── Settings/     # 설정
│   ├── hooks/            # 커스텀 React hooks
│   ├── store/            # Redux store 설정
│   │   ├── slices/       # Redux slices
│   │   └── api/          # API 관련 코드
│   ├── services/         # 외부 API 서비스
│   ├── types/            # TypeScript 타입 정의
│   ├── utils/            # 유틸리티 함수
│   ├── themes/           # UI 테마 설정
│   └── assets/           # 정적 자산
├── cypress/              # E2E 테스트
├── docker/               # Docker 설정
└── docs/                 # 문서
```

## 설치 및 실행

### Prerequisites
- Node.js 18+
- npm 또는 yarn

### 설치
```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일에서 필요한 값들을 설정하세요
```

### 개발 서버 실행
```bash
npm run dev
```

### 빌드
```bash
npm run build
```

### 테스트 실행
```bash
# 단위 테스트
npm run test

# 커버리지 포함 테스트
npm run test:coverage

# E2E 테스트
npm run test:e2e
```

## 환경 변수

```bash
# API 서버 주소
REACT_APP_API_BASE_URL=http://localhost:8000/api

# Auth0 설정
REACT_APP_AUTH0_DOMAIN=your-domain.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your-client-id
REACT_APP_AUTH0_AUDIENCE=your-api-audience
```

## Docker 배포

```bash
# Docker 이미지 빌드
docker build -t coin-invest-frontend .

# 컨테이너 실행
docker run -p 80:80 coin-invest-frontend
```

## 보안 고려사항

### 1. 인증 및 권한
- Auth0를 통한 OAuth 2.0/OpenID Connect 구현
- JWT 토큰 자동 갱신
- Role-based access control (RBAC)

### 2. 데이터 보호
- HTTPS 통신 강제
- 민감한 데이터 클라이언트 사이드 암호화
- CSP 헤더를 통한 XSS 방지

### 3. API 보안
- Rate limiting 구현
- CORS 설정
- API 키 관리

## 성능 최적화

### 1. 번들 최적화
- Tree shaking을 통한 불필요한 코드 제거
- 코드 스플리팅으로 초기 로딩 시간 단축
- 이미지 최적화 및 lazy loading

### 2. 캐싱 전략
- Service Worker를 통한 오프라인 지원
- Browser caching 최적화
- API 응답 캐싱

### 3. 렌더링 최적화
- React.memo를 통한 불필요한 재렌더링 방지
- Virtual scrolling for large datasets
- Debounced 검색 및 입력

## 접근성 (Accessibility)

- ARIA 속성 적절한 사용
- 키보드 네비게이션 지원
- 스크린 리더 최적화
- 고대비 모드 지원
- 텍스트 크기 조절 가능

## 브라우저 지원

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 기여 가이드라인

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### 코드 스타일
- ESLint 및 Prettier 설정 준수
- TypeScript 타입 안전성 유지
- 컴포넌트별 테스트 작성

## 라이선스

이 프로젝트는 MIT 라이선스 하에 제공됩니다.

## 지원 및 문의

- GitHub Issues: 버그 리포트 및 기능 요청
- Email: support@coin-invest-platform.com
- Documentation: https://docs.coin-invest-platform.com

## 로드맵

### Phase 1 (완료)
- [x] 기본 프로젝트 설정
- [x] 인증 시스템 구현
- [x] 레이아웃 및 네비게이션
- [x] 기본 대시보드

### Phase 2 (진행 중)
- [ ] 포트폴리오 관리 기능
- [ ] 실시간 마켓 데이터 연동
- [ ] 기본 백테스팅 기능

### Phase 3 (계획)
- [ ] 고급 차트 및 시각화
- [ ] 전략 빌더 인터페이스
- [ ] 리스크 관리 도구

### Phase 4 (계획)
- [ ] 성능 최적화
- [ ] 고급 보안 기능
- [ ] 모바일 앱 개발