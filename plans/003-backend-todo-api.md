# Plan: Backend Todo API

- 번호: `003`
- 상태: `Completed`
- 생성일: `2026-06-24`
- 승인일: `2026-06-24`
- 완료일: `2026-06-24`
- 대응 로그: `logs/003-backend-todo-api.md`

## 1. 목표

FastAPI, SQLAlchemy, SQLite 기반 Todo CRUD API를 구현하고, 향후 프론트엔드 작업에서 `actions.ts`를 사용할 수 있도록 Server Actions 정책을 문서에 반영한다.

## 2. 범위

### 포함

- `AGENTS.md`, `docs/ARCHITECTURE.md`의 Server Actions 및 `actions.ts` 정책 수정
- `backend/main.py` 단일 파일 안에 Todo 모델, 스키마, DB 세션, CRUD 라우트 구현
- 테스트용 앱 팩토리 `create_app(database_url: str | None = None)` 추가
- Todo API 계약을 검증하는 pytest 추가

### 제외

- 실제 `frontend/app/**/actions.ts` 생성
- Next.js API Route 프록시 구현
- 프론트엔드 Todo CRUD UI 연결
- FastAPI CORS 설정
- 인증, 사용자 구분, Alembic, 페이지네이션
- 기존 `../kakao-assignment-1` 파일 수정

## 3. 구현 계획

- 문서의 Server Actions 금지 문구를 API Route 유지와 `actions.ts` 허용 정책으로 바꾼다.
- 백엔드 앱 팩토리에서 환경변수 또는 인자로 DB URL을 결정하고 SQLite 엔진과 세션을 구성한다.
- 앱 시작 시 SQLAlchemy `create_all`로 Todo 테이블을 만든다.
- Pydantic 2 스키마로 생성, 수정, 응답 데이터를 검증한다.
- 한국 표준시 `+09:00` timezone-aware datetime을 생성하고 응답에서 ISO 문자열로 반환한다.
- `GET`, `POST`, `GET by id`, `PATCH`, `DELETE` Todo 엔드포인트를 계약대로 구현한다.
- pytest는 임시 SQLite 파일을 사용하는 앱 인스턴스를 만들어 운영 DB와 분리한다.

## 4. API·타입 변경

- FastAPI 엔드포인트를 추가한다.
  - `GET /todos?due_date=YYYY-MM-DD&completed=true|false`
  - `POST /todos`
  - `GET /todos/{todo_id}`
  - `PATCH /todos/{todo_id}`
  - `DELETE /todos/{todo_id}`
- `PATCH /todos/{todo_id}`는 `title` 또는 `completed` 중 하나 이상을 허용한다.
- 응답은 기존 `docs/API.md`의 `Todo` 계약을 따른다.

## 5. 테스트 계획

- `backend/.venv/Scripts/python -m ruff check .`
- `backend/.venv/Scripts/python -m pytest`
- `powershell -ExecutionPolicy Bypass -File ./scripts/verify-before-commit.ps1 -Phase PreStage`
- stage 후 `powershell -ExecutionPolicy Bypass -File ./scripts/verify-before-commit.ps1 -Phase Staged`

## 6. 완료 기준

- [x] 구현 항목이 승인된 범위와 일치한다.
- [x] 관련 자동 테스트가 통과한다.
- [x] 필수 정적 검증과 빌드가 통과한다.
- [x] 관련 문서가 현재 구현과 일치한다.
- [x] 대응 하네스 로그의 요약과 검증 결과가 완성되었다.
- [x] 커밋 전 `PreStage`와 `Staged` 검증이 통과했다.
- [x] staged 파일과 제안 커밋 메시지를 사용자에게 제시했다.

## 진행 기록

- `2026-06-24`: 사용자 승인에 따라 Plan을 작성하고 In Progress로 시작했다.
- `2026-06-24`: 백엔드 Todo CRUD API와 Server Actions 정책 문서 변경을 구현하고 PreStage 검증을 통과했다.
- `2026-06-24`: Staged 검증을 통과하고 커밋 준비를 완료했다.
