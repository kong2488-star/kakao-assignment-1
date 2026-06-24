# Plan: Project Structure

- 번호: `002`
- 상태: `Completed`
- 생성일: `2026-06-24`
- 승인일: `2026-06-24`
- 완료일: `2026-06-24`
- 대응 로그: `logs/002-project-structure.md`

## 1. 목표

`kakao-assignment-3` 안에 Next.js 프론트엔드와 FastAPI 백엔드가 독립적으로 실행·검증될 수 있는 초기 프로젝트 구조를 만든다. 기존 `kakao-assignment-1`은 동작과 보라색 계열 디자인을 확인하기 위한 참고 자료로만 사용하고, 새 구현은 문서에 정의된 아키텍처와 검증 흐름을 따르도록 준비한다.

## 2. 범위

### 포함

- `frontend/` Next.js 15 App Router 기반 프로젝트 골격 생성
- `backend/` FastAPI 기반 프로젝트 골격 생성
- 프론트엔드와 백엔드의 기본 환경 예시, ignore 규칙, README 작성
- 실행·검증 명령이 가능한 최소 설정 파일 추가
- 이후 Todo 기능 구현을 위한 라우트·테스트 디렉터리 배치

### 제외

- Todo CRUD 실제 기능 구현
- SQLite 모델, SQLAlchemy 세션, FastAPI 엔드포인트 상세 구현
- Next.js API Route 프록시 상세 구현
- 기존 `kakao-assignment-1` 파일 수정 또는 이동
- 인증, 사용자 구분, Alembic, 페이지네이션, 데이터 이전

## 3. 구현 계획

- `frontend/`에 Next.js App Router 구조와 TypeScript, Tailwind CSS 4, ESLint, Prettier, Axios 의존성 설정을 추가한다.
- `frontend/app` 아래에 문서상 목표 경로인 `/`, `/todos`, `/todos/new`, `/todos/[todoId]`, `/api/todos`, `/api/todos/[todoId]` 파일을 배치하되, 이번 단계에서는 최소 placeholder 또는 명시적 미구현 응답만 둔다.
- `frontend/.env.example`에 서버 전용 `BACKEND_API_URL` 예시를 제공하고 실제 `.env.local`은 ignore한다.
- `backend/`에 `main.py`, `requirements.txt`, `.env.example`, `tests/`를 추가한다.
- `backend/main.py`는 앱이 부팅되는 최소 FastAPI 인스턴스와 헬스 체크 수준의 기본 동작만 둔다.
- `backend/tests/`에는 프로젝트 구조 검증 또는 앱 부팅 검증을 위한 최소 pytest를 둔다.
- 각 영역 README에는 실행 방법, 선택한 구조, 새 의존성의 이유를 간단히 기록한다.
- 생성물, 캐시, DB, 가상환경, 실제 환경 파일이 커밋되지 않도록 `.gitignore`를 구성한다.

## 4. API·타입 변경

- Todo REST API 계약 자체는 변경하지 않는다.
- 이번 단계에서 Todo CRUD 엔드포인트는 구현하지 않는다.
- 프론트엔드 API Route 파일은 문서상 경로를 예약하기 위한 구조만 제공한다.

## 5. 테스트 계획

- Frontend
  - `npm install`
  - `npm run lint`
  - `npm run format:check`
  - `npm run typecheck`
  - `npm run build`
- Backend
  - `python -m pip install -r requirements.txt`
  - `ruff check .`
  - `pytest`
- 수동 확인
  - `frontend/`와 `backend/`의 README 실행 명령이 현재 설정과 일치하는지 확인한다.
  - 생성된 디렉터리 구조가 `docs/ARCHITECTURE.md`의 목표 구조와 일치하는지 확인한다.

## 6. 완료 기준

- [x] 구현 항목이 승인된 범위와 일치한다.
- [x] 관련 자동 테스트가 통과한다.
- [x] 필수 정적 검증과 빌드가 통과한다.
- [x] 관련 문서가 현재 구현과 일치한다.
- [x] 대응 하네스 로그의 요약과 검증 결과가 완성되었다.
- [x] 커밋 전 `PreStage`와 `Staged` 검증이 통과했다.
- [x] staged 파일과 제안 커밋 메시지를 사용자에게 제시했다.

## 진행 기록

- `2026-06-24`: 기존 문서와 현재 `kakao-assignment-3` 구조를 확인하고 초기 프로젝트 구조 작업 Plan을 Draft로 작성했다.
- `2026-06-24`: 사용자 승인에 따라 Plan을 In Progress로 전환했다.
- `2026-06-24`: 프론트엔드와 백엔드 초기 구조를 생성하고 개별 lint, format check, typecheck, build, Ruff, pytest 검증을 통과했다.
- `2026-06-24`: Git dubious ownership 차단으로 `PreStage` 게이트는 실행 완료하지 못했다.
- `2026-06-24`: `kakao-assignment-3`에 로컬 Git 저장소를 생성하고 `week03-eojin` 브랜치에서 `PreStage` 게이트를 통과했다.
- `2026-06-24`: Staged 게이트를 통과하고 커밋 준비를 완료했다.
