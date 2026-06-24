# Harness Log: Backend Todo API

- Plan 번호: `003`
- Plan 경로: `plans/003-backend-todo-api.md`
- 상태: `Completed`
- 시작일: `2026-06-24`
- 완료일: `2026-06-24`

## 작업 요약

- Server Actions와 `actions.ts` 허용 정책을 문서에 반영하고, FastAPI Todo CRUD API를 SQLAlchemy와 SQLite 기반으로 구현했다.
- 임시 SQLite DB를 사용하는 pytest로 API 계약을 검증했다.

## 주요 결정과 근거

- 결정:
  - Todo 백엔드는 `backend/main.py` 단일 파일에 유지한다.
  - 근거: `docs/BACKEND.md`가 초기에는 앱, DB, 모델, 스키마, 라우터를 단일 파일에 두도록 규정한다.
- 결정:
  - `actions.ts`는 허용 정책만 반영하고 실제 파일은 만들지 않는다.
  - 근거: 이번 작업 범위는 백엔드 API 구현이며 프론트 CRUD 연결은 후속 Plan으로 분리되어 있다.

## 변경 파일

- `AGENTS.md`: Server Actions와 `actions.ts` 허용 정책으로 수정
- `docs/ARCHITECTURE.md`: 요청 흐름과 Server Actions 사용 정책 수정
- `backend/main.py`: SQLAlchemy Todo 모델, 앱 팩토리, SQLite 세션, CRUD 라우트 구현
- `backend/tests/test_main.py`: Todo API 계약 검증 테스트 추가
- `backend/.gitignore`: 테스트 DB 임시 디렉터리 ignore 추가

## 의미 있는 명령과 결과

- `backend/.venv/Scripts/python -m ruff check .`
  - 결과: 실패. 미사용 import와 88자 초과 줄을 확인했다.
- `backend/.venv/Scripts/python -m pytest`
  - 결과: 성공. 17개 테스트 통과, FastAPI TestClient deprecation warning 1건.
- `powershell -ExecutionPolicy Bypass -File ./scripts/verify-before-commit.ps1 -Phase PreStage`
  - 결과: 실패. escalated 환경에서 pytest `tmp_path`가 사용자 Temp 디렉터리에 접근하지 못했다.
- `backend/.venv/Scripts/python -m ruff check .`
  - 결과: 성공.
- `backend/.venv/Scripts/python -m pytest`
  - 결과: 성공. 17개 테스트 통과, FastAPI TestClient deprecation warning 1건.
- `powershell -ExecutionPolicy Bypass -File ./scripts/verify-before-commit.ps1 -Phase PreStage`
  - 결과: 성공. 프론트엔드 lint, format check, typecheck, production build와 백엔드 Ruff, pytest 통과.
- `powershell -ExecutionPolicy Bypass -File ./scripts/verify-before-commit.ps1 -Phase Staged`
  - 결과: 성공. staged diff whitespace, Markdown 링크, 필수 구조, Plan/log 매칭, 금지 파일과 민감정보 검사를 통과했다.

## 실패와 해결

- 실패:
  - Ruff가 미사용 import와 긴 줄을 보고했다.
  - 원인: 초기 구현에서 `datetime.UTC`를 사용하지 않았고 일부 선언이 line-length 기준을 초과했다.
  - 해결: 미사용 import를 제거하고 긴 선언을 여러 줄로 분리했다.
- 실패:
  - PreStage의 백엔드 pytest가 `PermissionError`로 실패했다.
  - 원인: escalated 환경에서 pytest 기본 임시 디렉터리 `C:/Users/User/AppData/Local/Temp/pytest-of-User`를 스캔할 수 없었다.
  - 해결: 테스트 DB fixture가 백엔드 폴더 안의 ignored `.test-dbs/` 아래에 임시 디렉터리를 만들도록 변경했다.
- 실패:
  - 로컬 pytest에서 테스트 종료 시 SQLite 테스트 DB 파일 삭제가 `PermissionError`로 실패했다.
  - 원인: SQLAlchemy engine이 SQLite 파일 핸들을 유지한 상태에서 임시 디렉터리를 삭제했다.
  - 해결: 앱에 engine을 보관하고 테스트 클라이언트 종료 후 `dispose()`를 호출하도록 변경했다.

## 검증 결과

- PreStage 검증: 성공.
- Staged 검증: 성공.
- 자동 테스트: `backend/.venv/Scripts/python -m pytest` 성공. 17개 테스트 통과.
- 정적 검사: `backend/.venv/Scripts/python -m ruff check .`, 프론트엔드 lint, format check, typecheck 성공.
- 빌드: PreStage에서 `npm.cmd run build` 성공.
- 수동 검증: 문서 정책과 구현 범위가 승인된 Plan과 일치하는지 확인했다.
- 실행하지 못한 검증과 이유: 없음.

## 커밋 준비

- 현재 브랜치: `week03-eojin`
- staged 파일: `AGENTS.md`, `docs/ARCHITECTURE.md`, `backend/.gitignore`, `backend/main.py`, `backend/tests/test_main.py`, `plans/003-backend-todo-api.md`, `logs/003-backend-todo-api.md`
- staged diff 요약: 7 files changed, 555 insertions, 11 deletions.
- 제안 커밋 메시지: `feat: implement backend todo api`
- 사용자 커밋 승인: 없음.

## 미해결 사항과 후속 작업

- 프론트엔드 API Route 프록시와 `actions.ts` 기반 폼 흐름은 후속 Plan에서 구현한다.
