# 아키텍처

## 목표 구조

다음 구조를 기본으로 사용한다. 책임 분리나 필수 설정을 위해 파일을 추가할 수 있다.

```text
kakao-assignment-3/
├── AGENTS.md
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── BACKEND.md
│   ├── FRONTEND.md
│   ├── GIT_WORKFLOW.md
│   ├── HARNESS_LOGGING.md
│   ├── PLANNING.md
│   ├── PRE_COMMIT_VALIDATION.md
│   └── TESTING.md
├── logs/
│   ├── TEMPLATE.md
│   └── NNN-english-kebab-case-title.md
├── plans/
│   ├── TEMPLATE.md
│   └── NNN-english-kebab-case-title.md
├── scripts/
│   └── verify-before-commit.ps1
├── frontend/
│   ├── app/
│   │   ├── api/
│   │   │   └── todos/
│   │   │       ├── [todoId]/
│   │   │       │   └── route.ts
│   │   │       └── route.ts
│   │   ├── todos/
│   │   │   ├── [todoId]/
│   │   │   │   └── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   ├── error.tsx
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── .env.example
│   ├── .gitignore
│   ├── next-env.d.ts
│   ├── next.config.mjs
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── tsconfig.json
│   └── README.md
└── backend/
    ├── .env.example
    ├── main.py
    ├── requirements.txt
    └── tests/
```

## 요청 흐름

```text
Browser
  → Next.js API Route (/api/todos) 또는 Server Actions (actions.ts)
  → FastAPI (BACKEND_API_URL)
  → SQLAlchemy
  → SQLite
```

- 브라우저는 Axios로 같은 출처의 Next.js API Route만 호출한다.
- Next.js API Route는 FastAPI 요청을 중계하고 상태 코드와 응답 본문을 가능한 그대로 전달한다.
- FastAPI 주소는 서버 전용 환경변수로 관리하고 브라우저 번들에 노출하지 않는다.
- `actions.ts`는 프론트엔드 폼과 페이지 흐름을 처리하는 Server Actions 파일로 사용할 수 있다.
- Server Actions도 FastAPI 주소를 서버 측에서만 사용하고 브라우저 번들에 노출하지 않는다.
- FastAPI CORS는 설정하지 않는다.
- 별도의 서버 상태 라이브러리를 추가하지 않는다.

## 설계 범위

- 기존 Todo 기능과 보라색 계열 디자인을 유지한다.
- 기존 앱의 `localStorage` 데이터는 새 SQLite DB로 이전하지 않는다.
- 목록 페이지네이션은 적용하지 않는다.
- 초기 버전에는 인증, 사용자 구분, Alembic을 도입하지 않는다.
- 과제 규모를 넘어서는 전역 상태, 서비스 계층, 범용 추상화는 요구가 생길 때만 추가한다.
