# Harness Log: Frontend Todo Integration

- Plan 번호: `004`
- Plan 경로: `plans/004-frontend-todo-integration.md`
- 상태: `Completed`
- 시작일: `2026-06-24`
- 완료일: `2026-06-24`

## 작업 요약

- Next.js API Route 프록시, Server Actions, 실제 Todo 목록/생성/수정/완료/삭제 UI를 백엔드 Todo API에 연결했다.
- 주요 버튼 색상을 `purple-500` 계열로 낮추고 focus 상태 글자색을 흰색으로 맞췄으며 Todo UI/metadata의 `Kakao` 표기를 제거했다.

## 주요 결정과 근거

- 결정:
  - API Route 프록시는 유지하고 Server Actions는 폼과 항목 동작 흐름에 사용한다.
  - 근거: 문서 정책이 브라우저 직접 FastAPI 호출을 금지하면서 `actions.ts` 사용을 허용한다.
- 결정:
  - pending 상태가 필요한 폼과 항목만 클라이언트 컴포넌트로 분리한다.
  - 근거: 프론트엔드 규칙이 Server Component 기본값과 최소 `"use client"` 사용을 요구한다.

## 변경 파일

- `frontend/app/layout.tsx`: Todo 메타데이터에서 `Kakao` 표기 제거
- `frontend/app/api/todos/route.ts`: Todo 목록/생성 API Route 프록시 구현
- `frontend/app/api/todos/[todoId]/route.ts`: Todo 단건/수정/삭제 API Route 프록시 구현
- `frontend/app/todos/actions.ts`: 생성, 제목 수정, 완료 전환, 삭제 Server Actions 추가
- `frontend/app/todos/types.ts`: Todo, TodoStatus, 액션 상태 타입 추가
- `frontend/app/todos/date-utils.ts`: 날짜, 상태 쿼리 정규화와 날짜 이동 도우미 추가
- `frontend/app/todos/todo-api.ts`: 서버 전용 FastAPI 호출 도우미와 프록시 응답 도우미 추가
- `frontend/app/todos/page.tsx`: 실제 Todo 목록, 날짜 이동, 필터, 항목 동작 UI 연결
- `frontend/app/todos/new/page.tsx`, `frontend/app/todos/new/NewTodoForm.tsx`: Todo 생성 화면과 폼 연결
- `frontend/app/todos/[todoId]/page.tsx`, `frontend/app/todos/[todoId]/EditTodoForm.tsx`: Todo 수정 화면과 폼 연결
- `frontend/app/todos/TodoItemControls.tsx`: 완료 전환, 삭제 확인/요청 중 상태/오류 표시 추가
- `frontend/app/todos/error.tsx`: 버튼 색상과 focus 텍스트 색상 조정

## 의미 있는 명령과 결과

- `npm.cmd run lint`
  - 결과: 성공.
- `npm.cmd run typecheck`
  - 결과: 성공.
- `npm.cmd run format:check`
  - 결과: 최초 병렬 실행 중 일회성 symlink 오류가 있었으나 재실행 성공.
- `npm.cmd run build`
  - 결과: 성공. Next.js production build 통과.
- `backend/.venv/Scripts/python -m ruff check .`
  - 결과: 성공.
- `backend/.venv/Scripts/python -m pytest`
  - 결과: 성공. 17개 테스트 통과, FastAPI TestClient deprecation warning 1건.
- `powershell -ExecutionPolicy Bypass -File ./scripts/verify-before-commit.ps1 -Phase PreStage`
  - 결과: 성공. 프론트엔드 lint, format check, typecheck, production build 통과.
- `powershell -ExecutionPolicy Bypass -File ./scripts/verify-before-commit.ps1 -Phase Staged`
  - 결과: 성공. staged diff whitespace, Markdown 링크, 필수 구조, Plan/log 매칭, 금지 파일과 민감정보 검사를 통과했다.

## 실패와 해결

- 실패:
  - `npm.cmd run format:check`가 병렬 검증 중 `Explicitly specified pattern "." is a symbolic link.` 오류를 한 차례 보고했다.
  - 원인: 동일 시점에 여러 프론트 검증이 병렬 실행되며 Prettier의 파일 탐색이 일시적으로 흔들린 것으로 보인다.
  - 해결: 단독 재실행 시 정상 통과했고 이후 PreStage에서도 format check가 통과했다.

## 검증 결과

- PreStage 검증: 성공.
- Staged 검증: 성공.
- 자동 테스트: `backend/.venv/Scripts/python -m pytest` 성공. 17개 테스트 통과.
- 정적 검사: 프론트엔드 lint, format check, typecheck와 백엔드 Ruff 성공.
- 빌드: `npm.cmd run build` 성공.
- 수동 검증: `rg`로 `frontend/app`의 `Kakao` 표기 제거와 `bg-purple-700` 미사용을 확인했다.
- 실행하지 못한 검증과 이유: dev server 로그에는 백엔드 `http://127.0.0.1:8000`, 프론트엔드 `http://localhost:3001` 기동 기록이 남았지만 이후 HTTP 접속 확인이 실패해 브라우저 수동 시나리오는 완료하지 않았다.

## 커밋 준비

- 현재 브랜치: `week03-eojin`
- staged 파일: `frontend/app/layout.tsx`, `frontend/app/api/todos/*`, `frontend/app/todos/*`, `plans/004-frontend-todo-integration.md`, `logs/004-frontend-todo-integration.md`
- staged diff 요약: 16 files changed, 803 insertions, 109 deletions.
- 제안 커밋 메시지: `feat: connect frontend todo flow`
- 사용자 커밋 승인: 없음.

## 미해결 사항과 후속 작업

- 해당 사항 없음.
