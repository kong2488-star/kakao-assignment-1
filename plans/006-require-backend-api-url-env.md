# Plan: Require Backend API URL Env

- 번호: `006`
- 상태: `Completed`
- 생성일: `2026-06-24`
- 승인일: `2026-06-24`
- 완료일: `2026-06-24`
- 대응 로그: `logs/006-require-backend-api-url-env.md`

## 1. 목표

프론트엔드 Todo API 호출 코드에서 하드코딩된 백엔드 URL 기본값을 제거하고, `BACKEND_API_URL` 환경변수를 필수로 사용하게 만든다.

## 2. 범위

### 포함

- `frontend/app/todos/todo-api.ts`의 `http://localhost:8000` fallback 제거
- `BACKEND_API_URL`이 없을 때 명확한 설정 오류 발생
- 프론트엔드 문서의 환경변수 필수 조건 갱신
- 대응 Plan과 하네스 로그 작성

### 제외

- `.env.local` 파일 생성
- 브라우저에 노출되는 `NEXT_PUBLIC_` 환경변수 추가
- API Route 또는 FastAPI 백엔드 동작 변경

## 3. 구현 계획

- `getBackendApiUrl()`이 `process.env.BACKEND_API_URL`만 읽도록 한다.
- 값이 없거나 빈 문자열이면 설정 오류를 던진다.
- trailing slash는 기존처럼 제거해 URL 조합 방식을 유지한다.

## 4. API·타입 변경

- 공개 API 변경 없음.
- 환경 설정 요구사항 변경: frontend 실행 시 `BACKEND_API_URL`이 필수다.

## 5. 테스트 계획

- `cd frontend && npm.cmd run typecheck`
- `cd frontend && npm.cmd run build`
- `cd frontend && npm.cmd run lint`
- `cd frontend && npm.cmd run format:check`
- `powershell -ExecutionPolicy Bypass -File ./scripts/verify-before-commit.ps1 -Phase PreStage`
- stage 후 `powershell -ExecutionPolicy Bypass -File ./scripts/verify-before-commit.ps1 -Phase Staged`

## 6. 완료 기준

- [x] 하드코딩된 `http://localhost:8000` fallback이 제거됐다.
- [x] `BACKEND_API_URL` 누락 시 명확한 오류가 발생한다.
- [x] 필수 정적 검증과 빌드가 통과한다.
- [x] 대응 하네스 로그의 요약과 검증 결과가 완성되었다.
- [x] 커밋 전 `PreStage`와 `Staged` 검증이 통과했다.
- [x] staged 파일과 제안 커밋 메시지를 사용자에게 제시했다.

## 진행 기록

- `2026-06-24`: 사용자 승인에 따라 Plan을 작성하고 In Progress로 시작했다.
- `2026-06-24`: 하드코딩 fallback 제거와 문서 갱신을 완료하고 검증을 통과했다.
