# Plan: Remove Previous Assignment Files

- 번호: `007`
- 상태: `Completed`
- 생성일: `2026-06-24`
- 승인일: `2026-06-24`
- 완료일: `2026-06-24`
- 대응 로그: `logs/007-remove-previous-assignment-files.md`

## 1. 목표

`week03-eojin` 브랜치에서 이전 과제 루트 파일을 제거하고, 현재 `kakao-assignment-3` 프로젝트 파일만 남긴다.

## 2. 범위

### 포함

- 루트의 이전 Vite/vanilla Todo 앱 파일과 폴더 삭제
- 삭제 후 검증과 커밋/푸시 준비
- 대응 Plan과 하네스 로그 작성

### 제외

- 현재 과제 파일인 `AGENTS.md`, `backend/`, `docs/`, `frontend/`, `logs/`, `plans/`, `scripts/` 삭제
- 현재 과제 코드 동작 변경
- Git 히스토리 force push

## 3. 구현 계획

- 이전 과제 파일 목록을 확인한다.
- `git rm`으로 이전 과제 파일과 폴더만 삭제한다.
- 정적 검증과 PreStage/Staged 검증을 실행한다.
- 삭제 커밋을 만든 뒤 원격 `week03-eojin` 브랜치에 push한다.

## 4. API·타입 변경

- 변경 없음.

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

- [x] 이전 과제 루트 파일과 폴더가 삭제됐다.
- [x] 현재 과제 폴더와 문서는 유지됐다.
- [x] 필수 정적 검증과 테스트가 통과했다.
- [x] 대응 하네스 로그의 요약과 검증 결과가 완성되었다.
- [x] 커밋 전 `PreStage`와 `Staged` 검증이 통과했다.
- [x] 삭제 커밋과 push 준비가 완료됐다.

## 진행 기록

- `2026-06-24`: 사용자 승인에 따라 Plan을 작성하고 In Progress로 시작했다.
- `2026-06-24`: 이전 과제 파일 삭제와 검증을 완료하고 커밋 준비를 마쳤다.
