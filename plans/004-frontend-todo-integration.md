# Plan: Frontend Todo Integration

- 번호: `004`
- 상태: `Completed`
- 생성일: `2026-06-24`
- 승인일: `2026-06-24`
- 완료일: `2026-06-24`
- 대응 로그: `logs/004-frontend-todo-integration.md`

## 1. 목표

Next.js 프론트엔드를 백엔드 Todo API와 연결해 목록, 생성, 수정, 완료 전환, 삭제가 동작하는 Todo 앱을 만든다. 동시에 버튼 보라색 톤과 focus 글자색, 화면/메타데이터의 `Kakao` 표기 제거 요청을 반영한다.

## 2. 범위

### 포함

- Next.js `/api/todos`와 `/api/todos/[todoId]` 프록시 구현
- `frontend/app/todos/actions.ts` Server Actions 추가
- `/todos`, `/todos/new`, `/todos/[todoId]` 실제 데이터 연결
- Todo 관련 타입과 프론트엔드 도우미 추가
- 진한 보라색 버튼을 더 연한 보라색으로 조정
- focus 상태 글자색 흰색 적용
- Todo UI와 메타데이터에서 `Kakao` 표기 제거

### 제외

- FastAPI 백엔드 API 변경
- FastAPI CORS 설정
- 기존 `../kakao-assignment-1` 파일 수정
- `localStorage` 데이터 이전
- 인증, 사용자 구분, 페이지네이션

## 3. 구현 계획

- 서버 전용 백엔드 URL 도우미와 Todo 타입을 추가한다.
- API Route Handler에서 FastAPI로 요청을 프록시하고 상태 코드와 응답 본문을 전달한다.
- `actions.ts`에서 생성, 제목 수정, 완료 전환, 삭제 Server Action을 구현한다.
- 서버 컴포넌트 페이지에서 Todo 목록과 단건 Todo를 조회한다.
- 요청 pending 상태가 필요한 폼과 목록 항목만 클라이언트 컴포넌트로 분리한다.
- 기존 보라색 계열 디자인을 유지하되 버튼 색상과 focus 텍스트 색상을 요청대로 조정한다.

## 4. API·타입 변경

- Next.js 프록시를 구현한다.
  - `GET /api/todos?due_date=YYYY-MM-DD&status=all|active|completed`
  - `POST /api/todos`
  - `GET /api/todos/{todoId}`
  - `PATCH /api/todos/{todoId}`
  - `DELETE /api/todos/{todoId}`
- Server Actions를 추가한다.
  - `createTodoAction(previousState, formData)`
  - `updateTodoTitleAction(previousState, formData)`
  - `toggleTodoCompletedAction(formData)`
  - `deleteTodoAction(formData)`
- 프론트엔드 `Todo`, `TodoStatus`, 폼 상태 타입을 추가한다.

## 5. 테스트 계획

- `cd frontend && npm.cmd run lint`
- `cd frontend && npm.cmd run format:check`
- `cd frontend && npm.cmd run typecheck`
- `cd frontend && npm.cmd run build`
- `cd backend && ./.venv/Scripts/python -m ruff check .`
- `cd backend && ./.venv/Scripts/python -m pytest`
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
- `2026-06-24`: 프론트엔드 Todo 프록시, Server Actions, UI 연결과 보라색/focus/`Kakao` 문구 조정을 구현하고 PreStage 검증을 통과했다.
- `2026-06-24`: Staged 검증을 통과하고 커밋 준비를 완료했다.
