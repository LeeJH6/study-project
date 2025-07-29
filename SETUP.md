# 프로젝트 설정 가이드 - Study Portfolio

이 가이드는 새로운 컴퓨터에서 Study Portfolio 프로젝트를 설정하고 이전 작업을 이어서 개발할 수 있도록 도와줍니다.

## 🚀 새 컴퓨터에서 빠른 시작

### 사전 요구사항
- **Node.js** (v16 이상) - [여기서 다운로드](https://nodejs.org/)
- **Git** - [여기서 다운로드](https://git-scm.com/)
- **텍스트 에디터/IDE** - VS Code, WebStorm 또는 원하는 에디터

### 1단계: 저장소 클론

```bash
# 저장소 클론
git clone https://github.com/LeeJH6/study-project.git

# 프로젝트 디렉토리로 이동
cd study-project
```

### 2단계: 의존성 설치

```bash
# 모든 필요한 패키지 설치
npm install
```

**설치될 의존성들:**
- express (웹 프레임워크)
- body-parser (요청 파싱)
- cors (크로스 오리진 요청)
- express-validator (입력 검증)
- helmet (보안 헤더)
- express-rate-limit (속도 제한)
- express-mongo-sanitize (입력 정화)
- dotenv (환경 변수)
- nodemon (개발 자동 재시작)

### 3단계: 환경 설정

프로젝트 루트에 `.env` 파일 생성:

```bash
# .env 파일 생성
touch .env
```

`.env` 파일에 다음 내용 추가:

```env
NODE_ENV=development
PORT=3001
LOG_LEVEL=info

# 미래 데이터베이스 설정
DB_HOST=localhost
DB_PORT=5432
DB_NAME=study_portfolio
DB_USER=root
DB_PASSWORD=

# 미래 JWT 설정
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

**⚠️ 중요**: 민감한 정보가 포함된 `.env` 파일은 절대 git에 커밋하지 마세요.

### 4단계: 설정 확인

```bash
# 개발 서버 시작
npm run dev

# 또는 프로덕션 모드로 시작
npm start
```

다음과 같이 표시되어야 합니다:
```
🚀 Study Portfolio 서버가 http://localhost:3001 에서 실행 중입니다.
Environment: development
```

### 5단계: API 테스트

새 터미널을 열고 엔드포인트를 테스트해보세요:

```bash
# GET 엔드포인트 테스트
curl http://localhost:3001/api/papers

# 검증 포함 POST 엔드포인트 테스트
curl -X POST http://localhost:3001/api/papers \
  -H "Content-Type: application/json" \
  -d '{"title":"테스트 논문","authors":"당신의 이름","summary":"테스트 요약","content":"테스트 내용","tags":["테스트"]}'

# 검증 오류 테스트
curl -X POST http://localhost:3001/api/papers \
  -H "Content-Type: application/json" \
  -d '{"title":"","authors":"","summary":"","content":""}'
```

## 🔄 개발 이어가기

### 최신 변경사항 가져오기

```bash
# 작업 시작 전 항상 최신 변경사항을 가져오세요
git pull origin main

# 새 의존성이 있으면 설치
npm install
```

### 개발 워크플로우

1. **개발 서버 시작**
   ```bash
   npm run dev
   ```

2. **변경사항 작업**
   - 파일 변경 시 서버가 자동으로 재시작됩니다
   - 디버깅을 위해 `logs/error.log`에서 로그를 확인하세요

3. **변경사항 테스트**
   - API 엔드포인트를 사용하여 기능을 테스트하세요
   - 브라우저에서 `http://localhost:3001` 확인

4. **변경사항 커밋**
   ```bash
   git add .
   git commit -m "설명적인 커밋 메시지"
   git push origin main
   ```

## 📁 프로젝트 구조 개요

```
study-project/
├── server.js                 # 메인 Express 서버
├── package.json              # 의존성 및 스크립트
├── .env                      # 환경 변수 (이 파일을 생성하세요)
├── .gitignore               # Git 무시 규칙
├── config/                  # 설정 관리
│   └── config.js            # 중앙화된 설정
├── middleware/              # 커스텀 미들웨어
│   ├── validation.js        # 입력 검증 규칙
│   └── errorHandler.js      # 오류 처리 및 로깅
├── logs/                    # 애플리케이션 로그 (자동 생성)
│   └── error.log           # 오류 로그
├── data/                    # JSON 데이터 저장소 (자동 생성)
│   ├── papers.json         # 논문 리뷰
│   ├── experiments.json    # 실험
│   ├── algorithms.json     # 알고리즘
│   └── course-notes.json   # 수업 노트
└── public/                  # 프론트엔드 파일들
    ├── index.html          # 메인 페이지
    ├── pages/              # 카테고리 페이지들
    ├── styles/             # CSS 파일들
    └── scripts/            # JavaScript 파일들
```

## 🛠️ 사용 가능한 명령어

```bash
# 자동 재시작 개발 모드
npm run dev

# 프로덕션 시작
npm start

# 의존성 설치
npm install

# 패키지 정보 보기
npm list
```

## 🔍 문제 해결

### 자주 발생하는 문제들

**포트가 이미 사용 중인 경우**
```bash
# .env 파일에서 포트 변경
PORT=3002
```

**권한 오류**
```bash
# Windows에서는 관리자로 실행
# macOS/Linux에서는 파일 권한 확인
chmod 755 .
```

**의존성 누락**
```bash
# 깨끗한 설치
rm -rf node_modules package-lock.json
npm install
```

**환경 변수가 로드되지 않는 경우**
- 프로젝트 루트에 `.env` 파일이 있는지 확인
- `.env` 파일 형식 확인 (= 주변에 공백 없이)
- `.env` 변경 후 서버 재시작

### API 테스팅 도구

**curl 사용 (터미널)**
```bash
# GET 요청
curl http://localhost:3001/api/papers

# POST 요청
curl -X POST http://localhost:3001/api/papers \
  -H "Content-Type: application/json" \
  -d '{"title":"테스트","authors":"나","summary":"요약","content":"내용"}'
```

**브라우저 사용**
- GET 요청: 브라우저에서 `http://localhost:3001/api/papers` 열기
- POST/PUT/DELETE: Postman, Insomnia 또는 브라우저 개발자 도구 사용

### 로그 파일

- **오류 로그**: `logs/error.log`
- **콘솔 로그**: 서버가 실행 중인 터미널

## 📋 현재 API 엔드포인트

### 모든 리소스에 대한 완전한 CRUD

**논문 (`/api/papers`)**
- `GET /api/papers` - 모든 논문 목록
- `POST /api/papers` - 새 논문 생성 (검증됨, 속도 제한됨)
- `PUT /api/papers/:id` - 논문 수정 (검증됨)
- `DELETE /api/papers/:id` - 논문 삭제

**실험 (`/api/experiments`)**
- `GET /api/experiments` - 모든 실험 목록
- `POST /api/experiments` - 새 실험 생성 (검증됨, 속도 제한됨)
- `PUT /api/experiments/:id` - 실험 수정 (검증됨)
- `DELETE /api/experiments/:id` - 실험 삭제

**알고리즘 (`/api/algorithms`)**
- `GET /api/algorithms` - 모든 알고리즘 목록
- `POST /api/algorithms` - 새 알고리즘 생성 (검증됨, 속도 제한됨)
- `PUT /api/algorithms/:id` - 알고리즘 수정 (검증됨)
- `DELETE /api/algorithms/:id` - 알고리즘 삭제

**수업 노트 (`/api/course-notes`)**
- `GET /api/course-notes` - 모든 수업 노트 목록
- `POST /api/course-notes` - 새 수업 노트 생성 (검증됨, 속도 제한됨)
- `PUT /api/course-notes/:id` - 수업 노트 수정 (검증됨)
- `DELETE /api/course-notes/:id` - 수업 노트 삭제

**유틸리티**
- `GET /api/recent-posts` - 모든 카테고리에서 최근 5개 게시물 가져오기

## 🔐 보안 기능

- **속도 제한**: 15분당 100개 요청 (일반), 분당 5개 요청 (POST)
- **입력 검증**: 모든 엔드포인트에 대한 포괄적인 필드 검증
- **보안 헤더**: 보안 헤더를 위한 Helmet.js
- **입력 정화**: 주입 공격에 대한 보호
- **오류 처리**: 민감한 데이터 노출 없이 구조화된 오류 로깅

## 🎯 다음 단계 (Phase 2)

개발을 계속할 준비가 되면:

1. **라우트 모듈화**: 라우트를 개별 파일로 분리
2. **헬스 체크 엔드포인트**: `/health` 및 `/metrics` 엔드포인트 추가
3. **요청/응답 로깅**: API 로깅을 위한 미들웨어 추가
4. **프론트엔드 업데이트**: 프론트엔드에 UPDATE 및 DELETE 작업 추가

## 📞 지원

문제가 발생하면:

1. `logs/error.log`에서 오류 로그 확인
2. 모든 환경 변수가 올바르게 설정되었는지 확인
3. Node.js 버전이 호환되는지 확인 (v16+)
4. 포트가 이미 사용 중이지 않은지 확인

## 📋 Phase 1 완료 상태

- ✅ 모든 리소스에 대한 완전한 CRUD 작업
- ✅ express-validator를 사용한 입력 검증
- ✅ 보안 미들웨어 (helmet, 속도 제한, 정화)
- ✅ 중앙화된 오류 처리 및 로깅
- ✅ 환경 설정 관리
- ✅ 업데이트된 프로젝트 구조 및 문서화

Phase 2 개발을 계속할 준비가 완료되었습니다!