# 코인 투자 백테스팅 플랫폼

## 개요

암호화폐 투자 전략의 백테스팅을 위한 종합적인 플랫폼입니다. 실제 시장 데이터를 기반으로 투자 전략을 검증하고 최적화할 수 있습니다.

## 아키텍처

### 백엔드
- **데이터 수집**: OKX API를 통한 실시간 암호화폐 데이터 수집
- **백테스팅 엔진**: 고성능 백테스팅 알고리즘
- **API 서버**: RESTful API 제공

### 프론트엔드
- **React 18 + TypeScript**: 현대적인 웹 애플리케이션
- **Material-UI**: 일관된 디자인 시스템
- **Redux Toolkit**: 효율적인 상태 관리
- **Auth0**: 보안 인증 시스템

## 프로젝트 구조

```
coin-invest-backtesting/
├── data/                    # 데이터 수집 모듈
│   └── okx_data_fetcher.py # OKX API 데이터 페처
├── frontend/               # React 프론트엔드
│   ├── src/               # 소스 코드
│   ├── public/            # 정적 파일
│   └── docker/            # Docker 설정
├── docs/                  # 문서
└── README.md
```

## 주요 특징

### 🔐 보안성
- Multi-factor Authentication (MFA)
- Content Security Policy (CSP)
- JWT 토큰 관리
- API Rate Limiting
- 데이터 암호화

### 🛡️ 안정성
- Error Boundary 구현
- 타입 안전성 (TypeScript)
- 포괄적인 테스트 커버리지
- 모니터링 및 로깅

### 👥 사용자 편의성
- 반응형 디자인
- 다국어 지원 (한/영/일/중)
- 접근성 (WCAG 2.1 AA)
- 직관적인 UI/UX

### ⚡ 성능
- 코드 스플리팅
- 가상화 (Virtual Scrolling)
- CDN 통합
- Progressive Web App

## 시작하기

### 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev
```

### 백엔드 설정
```bash
pip install pandas httpx ratelimit asyncio
python -c "from data.okx_data_fetcher import fetch_okx_data; import asyncio; print('Ready')"
```

## 문서

- [프론트엔드 아키텍처 계획](./frontend_architecture_plan.md)
- [프론트엔드 README](./frontend/README.md)
- [보안 가이드라인](./frontend/security.conf)

## 라이선스

MIT License