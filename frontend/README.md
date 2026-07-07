# Kakao Assignment 3 Frontend

Next.js App Router 기반 Todo 프론트엔드다. 브라우저는 같은 출처의 `/api/todos` 프록시만 호출하고, 백엔드 주소는 서버 전용 `BACKEND_API_URL` 환경변수로 관리한다.

## 실행

```bash
npm install
npm run dev
```

기본 개발 서버는 `http://localhost:3000`이다.

## 검증

```bash
npm run lint
npm run format:check
npm run typecheck
npm run build
```

## 구조와 의존성

- `app/`: Next.js App Router 페이지와 API Route
- `app/api/todos/`: FastAPI Todo API를 중계할 서버 전용 프록시 경로
- `axios`: 클라이언트 Todo CRUD 요청에 사용할 HTTP 클라이언트
- `tailwindcss`: 기존 보라색 계열 디자인을 유지할 스타일링 도구
