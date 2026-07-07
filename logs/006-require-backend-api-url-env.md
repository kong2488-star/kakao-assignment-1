# Harness Log: Require Backend API URL Env

- Plan 번호: `006`
- Plan 경로: `plans/006-require-backend-api-url-env.md`
- 상태: `Completed`
- 시작일: `2026-06-24`
- 완료일: `2026-06-24`

## 작업 요약

- 프론트엔드 Todo API 호출 코드에서 하드코딩된 백엔드 URL fallback을 제거했다.
- `BACKEND_API_URL`이 없을 때 명확한 설정 오류가 발생하도록 했다.

## 주요 결정과 근거

- 결정:
  - `BACKEND_API_URL`을 필수 환경변수로 둔다.
  - 근거: 사용자가 하드코딩된 기본값 제거를 요청했다.
- 결정:
  - `NEXT_PUBLIC_` 환경변수는 만들지 않는다.
  - 근거: 백엔드 URL은 서버 전용으로만 사용한다는 기존 프론트엔드 규칙을 유지한다.

## 변경 파일

- `frontend/app/todos/todo-api.ts`: localhost fallback 제거 및 필수 env 검증 추가
- `docs/FRONTEND.md`: `BACKEND_API_URL` 필수 조건 기록
- `plans/006-require-backend-api-url-env.md`: 승인된 작업 계획 기록
- `logs/006-require-backend-api-url-env.md`: 작업 이력과 검증 결과 기록

## 의미 있는 명령과 결과

- `npm.cmd run typecheck`
  - 결과: 성공.
- `npm.cmd run lint`
  - 결과: 성공.
- `npm.cmd run format:check`
  - 결과: 성공.
- `npm.cmd run build`
  - 결과: 성공. Next.js production build 통과.
- `rg -n "http://localhost:8000|DEFAULT_BACKEND_API_URL|BACKEND_API_URL" frontend/app/todos/todo-api.ts docs/FRONTEND.md frontend/.env.example`
  - 결과: 코드의 fallback 상수는 제거됐고, 남은 localhost 문자열은 문서와 env 예시에만 있음을 확인했다.

## 실패와 해결

- 해당 사항 없음.

## 검증 결과

- PreStage 검증: 성공.
- Staged 검증: 성공.
- 자동 테스트: 이번 변경은 프론트엔드 env 처리와 문서 변경이라 별도 자동 테스트는 실행하지 않았다.
- 정적 검사: `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run format:check` 성공.
- 빌드: `npm.cmd run build` 성공.
- 수동 검증: 실행하지 않았다.
- 실행하지 못한 검증과 이유: 실제 서버 실행은 `.env.local` 유무와 로컬 백엔드 실행 상태에 의존하므로 정적 검증과 빌드로 범위를 확인했다.

## 커밋 준비

- 현재 브랜치: `week03-eojin`
- staged 파일: `frontend/app/todos/todo-api.ts`, `docs/FRONTEND.md`, `plans/006-require-backend-api-url-env.md`, `logs/006-require-backend-api-url-env.md`
- staged diff 요약: 4 files changed, 135 insertions, 5 deletions.
- 제안 커밋 메시지: `chore: require backend api url env`
- 사용자 커밋 승인: 없음.

## 미해결 사항과 후속 작업

- 해당 사항 없음.
