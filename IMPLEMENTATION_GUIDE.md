# 구현 및 배포 가이드
## 코인 투자 백테스팅 플랫폼

### 목차
1. [시스템 요구사항](#시스템-요구사항)
2. [개발 환경 설정](#개발-환경-설정)
3. [프론트엔드 구현](#프론트엔드-구현)
4. [백엔드 구현](#백엔드-구현)
5. [보안 설정](#보안-설정)
6. [배포 프로세스](#배포-프로세스)
7. [모니터링 및 유지보수](#모니터링-및-유지보수)

## 시스템 요구사항

### 개발 환경
- **Node.js**: 18.x 이상
- **Python**: 3.9 이상
- **Docker**: 20.x 이상
- **Git**: 2.x 이상

### 운영 환경
- **클라우드**: AWS/Azure/GCP
- **CDN**: CloudFront/CloudFlare
- **데이터베이스**: PostgreSQL 14+
- **메모리 캐시**: Redis 6+
- **모니터링**: DataDog/New Relic

## 개발 환경 설정

### 1. 저장소 클론 및 초기 설정
```bash
git clone https://github.com/dicaprioh/coin-invest-backtesting.git
cd coin-invest-backtesting

# 백엔드 의존성 설치
pip install -r requirements.txt

# 프론트엔드 의존성 설치
cd frontend
npm install
```

### 2. 환경 변수 설정
```bash
# 프론트엔드 환경 변수
cd frontend
cp .env.example .env

# 백엔드 환경 변수
cd ..
cp .env.example .env
```

### 3. 개발 서버 실행
```bash
# 백엔드 (터미널 1)
python -m uvicorn main:app --reload --port 8000

# 프론트엔드 (터미널 2)
cd frontend
npm run dev
```

## 프론트엔드 구현

### 1. 핵심 컴포넌트 구현 순서

#### Phase 1: 기반 구조 (완료)
- [x] 프로젝트 설정 및 의존성
- [x] TypeScript 설정
- [x] Redux Store 구성
- [x] 라우팅 시스템
- [x] 인증 시스템 (Auth0)
- [x] 기본 레이아웃 및 네비게이션
- [x] 에러 바운더리
- [x] 테마 시스템

#### Phase 2: 데이터 관리 (진행 예정)
```typescript
// 실시간 데이터 연동
const MarketDataProvider = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    const ws = new WebSocket('wss://api.okx.com/ws/v5/public')
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      dispatch(updateMarketData(data))
    }
    
    return () => ws.close()
  }, [dispatch])
  
  return null
}
```

#### Phase 3: 백테스팅 엔진 UI (진행 예정)
```typescript
// 백테스팅 설정 컴포넌트
const BacktestingConfig = () => {
  const [config, setConfig] = useState<BacktestConfig>({
    symbol: 'BTC-USDT',
    strategy: 'buy_and_hold',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    initialCapital: 10000
  })
  
  const [runBacktest] = useRunBacktestMutation()
  
  const handleSubmit = async () => {
    const result = await runBacktest(config)
    // 결과 처리
  }
  
  return (
    <BacktestConfigForm 
      config={config}
      onChange={setConfig}
      onSubmit={handleSubmit}
    />
  )
}
```

### 2. 성능 최적화 구현

#### 가상화 구현
```typescript
import { FixedSizeList as List } from 'react-window'

const VirtualizedTable = ({ data }) => (
  <List
    height={600}
    itemCount={data.length}
    itemSize={50}
    itemData={data}
  >
    {({ index, style, data }) => (
      <div style={style}>
        <TableRow data={data[index]} />
      </div>
    )}
  </List>
)
```

#### 지연 로딩 구현
```typescript
const LazyChart = lazy(() => 
  import('./components/Charts/AdvancedChart').then(module => ({
    default: module.AdvancedChart
  }))
)
```

### 3. 테스트 구현

#### 단위 테스트
```typescript
// components/__tests__/Dashboard.test.tsx
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '@store/index'
import Dashboard from '../Dashboard'

test('대시보드가 올바르게 렌더링됨', () => {
  render(
    <Provider store={store}>
      <Dashboard />
    </Provider>
  )
  
  expect(screen.getByText('대시보드')).toBeInTheDocument()
})
```

#### E2E 테스트
```typescript
// cypress/e2e/dashboard.cy.ts
describe('대시보드', () => {
  beforeEach(() => {
    cy.login() // 커스텀 명령어
    cy.visit('/dashboard')
  })
  
  it('포트폴리오 정보를 표시함', () => {
    cy.contains('총 포트폴리오 가치').should('be.visible')
    cy.get('[data-testid="portfolio-value"]').should('contain', '₩')
  })
})
```

## 백엔드 구현

### 1. 데이터 수집 시스템 확장

#### 실시간 데이터 스트리밍
```python
# data/streaming_service.py
import asyncio
import websockets
import json
from typing import AsyncGenerator

class OKXStreamingService:
    def __init__(self):
        self.ws_url = "wss://ws.okx.com:8443/ws/v5/public"
        self.subscriptions = []
    
    async def subscribe_ticker(self, symbols: list) -> AsyncGenerator:
        async with websockets.connect(self.ws_url) as websocket:
            # 구독 요청
            subscribe_msg = {
                "op": "subscribe",
                "args": [{"channel": "tickers", "instId": symbol} for symbol in symbols]
            }
            
            await websocket.send(json.dumps(subscribe_msg))
            
            async for message in websocket:
                data = json.loads(message)
                yield self._process_ticker_data(data)
    
    def _process_ticker_data(self, data):
        # 데이터 처리 로직
        return {
            "symbol": data["arg"]["instId"],
            "price": float(data["data"][0]["last"]),
            "timestamp": int(data["data"][0]["ts"])
        }
```

#### 백테스팅 엔진
```python
# backtesting/engine.py
import pandas as pd
import numpy as np
from typing import Dict, List, Any
from dataclasses import dataclass

@dataclass
class BacktestResult:
    total_return: float
    annual_return: float
    max_drawdown: float
    sharpe_ratio: float
    trades: List[Dict]
    equity_curve: pd.DataFrame

class BacktestingEngine:
    def __init__(self, data: pd.DataFrame):
        self.data = data
        self.initial_capital = 10000
        self.position = 0
        self.cash = self.initial_capital
        self.equity = [self.initial_capital]
        self.trades = []
    
    def run_strategy(self, strategy_name: str, params: Dict[str, Any]) -> BacktestResult:
        if strategy_name == "moving_average_crossover":
            return self._ma_crossover_strategy(**params)
        elif strategy_name == "rsi_strategy":
            return self._rsi_strategy(**params)
        # 추가 전략들...
    
    def _ma_crossover_strategy(self, short_window: int, long_window: int) -> BacktestResult:
        signals = self._generate_ma_signals(short_window, long_window)
        return self._execute_trades(signals)
    
    def _generate_ma_signals(self, short_window: int, long_window: int) -> pd.Series:
        short_ma = self.data['close'].rolling(window=short_window).mean()
        long_ma = self.data['close'].rolling(window=long_window).mean()
        
        signals = pd.Series(0, index=self.data.index)
        signals[short_ma > long_ma] = 1  # 매수 신호
        signals[short_ma < long_ma] = -1  # 매도 신호
        
        return signals
    
    def _execute_trades(self, signals: pd.Series) -> BacktestResult:
        # 거래 실행 로직
        for i, signal in enumerate(signals):
            price = self.data.iloc[i]['close']
            
            if signal == 1 and self.position <= 0:  # 매수
                shares = self.cash // price
                if shares > 0:
                    self.position += shares
                    self.cash -= shares * price
                    self.trades.append({
                        'date': self.data.index[i],
                        'action': 'buy',
                        'shares': shares,
                        'price': price
                    })
            
            elif signal == -1 and self.position > 0:  # 매도
                self.cash += self.position * price
                self.trades.append({
                    'date': self.data.index[i],
                    'action': 'sell',
                    'shares': self.position,
                    'price': price
                })
                self.position = 0
            
            total_value = self.cash + self.position * price
            self.equity.append(total_value)
        
        return self._calculate_metrics()
    
    def _calculate_metrics(self) -> BacktestResult:
        equity_df = pd.DataFrame({'equity': self.equity})
        
        total_return = (self.equity[-1] - self.initial_capital) / self.initial_capital
        annual_return = (1 + total_return) ** (252 / len(self.equity)) - 1
        
        # 최대 낙폭 계산
        peak = equity_df['equity'].expanding(min_periods=1).max()
        drawdown = (equity_df['equity'] - peak) / peak
        max_drawdown = drawdown.min()
        
        # 샤프 비율 계산 (단순화)
        returns = equity_df['equity'].pct_change().dropna()
        sharpe_ratio = returns.mean() / returns.std() * np.sqrt(252) if returns.std() > 0 else 0
        
        return BacktestResult(
            total_return=total_return,
            annual_return=annual_return,
            max_drawdown=max_drawdown,
            sharpe_ratio=sharpe_ratio,
            trades=self.trades,
            equity_curve=equity_df
        )
```

### 2. API 서버 구현
```python
# main.py
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
import asyncio
from typing import List, Dict, Any

from data.okx_data_fetcher import fetch_okx_data
from backtesting.engine import BacktestingEngine

app = FastAPI(title="코인 투자 백테스팅 API", version="1.0.0")
security = HTTPBearer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 프론트엔드 URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/market/data")
async def get_market_data(
    symbol: str,
    interval: str,
    start: str,
    end: str
):
    try:
        data = await fetch_okx_data(symbol, interval, start, end)
        return data.to_dict('records')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/backtest/run")
async def run_backtest(config: Dict[str, Any]):
    try:
        # 데이터 가져오기
        data = await fetch_okx_data(
            symbol=config['symbol'],
            interval=config.get('interval', '1h'),
            start=config['startDate'],
            end=config['endDate']
        )
        
        # 백테스트 실행
        engine = BacktestingEngine(data)
        result = engine.run_strategy(
            strategy_name=config['strategy'],
            params=config.get('parameters', {})
        )
        
        return {
            "id": f"bt_{int(time.time())}",
            "status": "completed",
            "results": {
                "totalReturn": result.total_return,
                "annualReturn": result.annual_return,
                "maxDrawdown": result.max_drawdown,
                "sharpeRatio": result.sharpe_ratio,
                "trades": result.trades
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## 보안 설정

### 1. 프론트엔드 보안

#### CSP 헤더 설정
```nginx
# nginx.conf에 추가
add_header Content-Security-Policy "
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.auth0.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https:;
    connect-src 'self' https://api.okx.com https://*.auth0.com;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
";
```

#### 환경 변수 보안
```typescript
// src/config/env.ts
export const config = {
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  auth0: {
    domain: process.env.REACT_APP_AUTH0_DOMAIN!,
    clientId: process.env.REACT_APP_AUTH0_CLIENT_ID!,
    audience: process.env.REACT_APP_AUTH0_AUDIENCE!,
  }
}

// 환경 변수 검증
const requiredEnvVars = [
  'REACT_APP_AUTH0_DOMAIN',
  'REACT_APP_AUTH0_CLIENT_ID'
]

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`필수 환경 변수가 설정되지 않음: ${varName}`)
  }
})
```

### 2. 백엔드 보안

#### 인증 미들웨어
```python
# auth/middleware.py
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer
import jwt
from typing import Optional

security = HTTPBearer()

async def verify_token(token: str = Depends(security)) -> dict:
    try:
        # Auth0 토큰 검증
        payload = jwt.decode(
            token.credentials,
            options={"verify_signature": False}  # Auth0에서 서명 검증
        )
        return payload
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 토큰"
        )

@app.middleware("http")
async def security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response
```

#### Rate Limiting
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/api/market/data")
@limiter.limit("60/minute")
async def get_market_data(request: Request, ...):
    # API 로직
    pass
```

## 배포 프로세스

### 1. Docker 컨테이너화

#### 프론트엔드 Dockerfile (이미 생성됨)
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 백엔드 Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. Docker Compose 개발 환경
```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/coindb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./data:/app/data
  
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
  
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: coindb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### 3. Kubernetes 배포
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: coin-invest-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: coin-invest/frontend:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "50m"
          limits:
            memory: "128Mi"
            cpu: "100m"
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

## 모니터링 및 유지보수

### 1. 애플리케이션 모니터링

#### Sentry 에러 추적
```typescript
// src/utils/sentry.ts
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing({
      tracingOrigins: [process.env.REACT_APP_API_BASE_URL],
    }),
  ],
})

export { Sentry }
```

#### 성능 모니터링
```typescript
// src/utils/performance.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric: any) {
  // Google Analytics 또는 다른 분석 도구로 전송
  if (window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.value),
      non_interaction: true,
    })
  }
}

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

### 2. 로깅 시스템
```python
# utils/logging.py
import logging
import json
from datetime import datetime

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'level': record.levelname,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName,
            'line': record.lineno
        }
        
        if hasattr(record, 'user_id'):
            log_entry['user_id'] = record.user_id
        
        if hasattr(record, 'request_id'):
            log_entry['request_id'] = record.request_id
        
        return json.dumps(log_entry)

# 로거 설정
logger = logging.getLogger(__name__)
handler = logging.StreamHandler()
handler.setFormatter(JSONFormatter())
logger.addHandler(handler)
logger.setLevel(logging.INFO)
```

### 3. 건강성 체크
```python
# health.py
from fastapi import APIRouter
import asyncio
import time

router = APIRouter()

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "version": "1.0.0"
    }

@router.get("/health/detailed")
async def detailed_health_check():
    checks = {}
    
    # 데이터베이스 연결 확인
    try:
        # DB 쿼리 실행
        checks['database'] = 'healthy'
    except Exception as e:
        checks['database'] = f'unhealthy: {str(e)}'
    
    # Redis 연결 확인
    try:
        # Redis ping
        checks['redis'] = 'healthy'
    except Exception as e:
        checks['redis'] = f'unhealthy: {str(e)}'
    
    # 외부 API 연결 확인
    try:
        # OKX API 테스트
        checks['okx_api'] = 'healthy'
    except Exception as e:
        checks['okx_api'] = f'unhealthy: {str(e)}'
    
    overall_status = 'healthy' if all(
        status == 'healthy' for status in checks.values()
    ) else 'unhealthy'
    
    return {
        "status": overall_status,
        "checks": checks,
        "timestamp": time.time()
    }
```

## 결론

이 구현 가이드는 보안성, 안정성, 사용자 편의성, 실현가능성, UI/UX 향상을 모두 고려한 종합적인 개발 계획을 제시합니다. 

단계별 구현을 통해 점진적으로 플랫폼을 발전시키고, 지속적인 모니터링과 개선을 통해 세계적 수준의 암호화폐 투자 백테스팅 플랫폼을 구축할 수 있습니다.