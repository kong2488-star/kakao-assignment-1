# Harness Log: Remove Previous Assignment Files

- Plan 번호: `007`
- Plan 경로: `plans/007-remove-previous-assignment-files.md`
- 상태: `Completed`
- 시작일: `2026-06-24`
- 완료일: `2026-06-24`

## 작업 요약

- 이전 과제 루트 파일을 현재 브랜치에서 삭제했다.
- 현재 `kakao-assignment-3` 과제 파일은 유지했다.

## 주요 결정과 근거

- 결정:
  - force push로 히스토리를 갈아엎지 않고 삭제 커밋을 추가한다.
  - 근거: 원격 브랜치의 기존 이력을 보존하면서 GitHub에 보이는 파일 구성을 정리할 수 있다.

## 변경 파일

- 루트 이전 과제 파일: `README.md`, `REFACTOR_PLAN.md`, `index.html`, 루트 package/config 파일 삭제
- 이전 과제 폴더: `src/`, `todo-vanilla/` 삭제
- `plans/007-remove-previous-assignment-files.md`: 승인된 작업 계획 기록
- `logs/007-remove-previous-assignment-files.md`: 작업 이력과 검증 결과 기록

## 의미 있는 명령과 결과

- `git rm README.md REFACTOR_PLAN.md index.html package-lock.json package.json postcss.config.js tailwind.config.js vite.config.js -r src todo-vanilla`
  - 결과: 이전 과제 루트 파일과 폴더 삭제 성공.
- `npm.cmd run lint`
  - 결과: 성공.
- `npm.cmd run typecheck`
  - 결과: 성공.
- `npm.cmd run format:check`
  - 결과: 최초 실패. 줄끝/포맷 상태가 흔들린 프론트 파일을 확인했다.
- `npx.cmd prettier --write ...`
  - 결과: 프론트 파일 포맷 정리 성공.
- `npm.cmd run build`
  - 결과: 성공. Next.js production build 통과.
- `backend/.venv/Scripts/python -m ruff check .`
  - 결과: 성공.
- `backend/.venv/Scripts/python -m pytest`
  - 결과: 성공. 17개 테스트 통과, FastAPI TestClient deprecation warning 1건.
- `powershell -ExecutionPolicy Bypass -File ./scripts/verify-before-commit.ps1 -Phase PreStage`
  - 결과: 성공.
- `powershell -ExecutionPolicy Bypass -File ./scripts/verify-before-commit.ps1 -Phase Staged`
  - 결과: 성공.

## 실패와 해결

- 실패:
  - `npm.cmd run format:check`가 프론트 파일 14개의 포맷 문제를 보고했다.
  - 원인: 이전 커밋 이후 Windows 줄끝/포맷 상태가 Prettier 기준과 달라져 있었다.
  - 해결: 해당 프론트 파일들에 Prettier를 적용하고 다시 검증했다.

## 검증 결과

- PreStage 검증: 성공.
- Staged 검증: 성공.
- 자동 테스트: `backend/.venv/Scripts/python -m pytest` 성공. 17개 테스트 통과.
- 정적 검사: 프론트엔드 lint, format check, typecheck와 백엔드 Ruff 성공.
- 빌드: `npm.cmd run build` 성공.
- 수동 검증: 루트 파일 목록에서 현재 과제 파일만 남았는지 확인했다.
- 실행하지 못한 검증과 이유: 브라우저 수동 실행은 파일 정리 작업이라 수행하지 않았다.

## 커밋 준비

- 현재 브랜치: `week03-eojin`
- staged 파일: 이전 과제 루트 파일 삭제, formatter-normalized 프론트 파일, `plans/007-remove-previous-assignment-files.md`, `logs/007-remove-previous-assignment-files.md`
- staged diff 요약: 22 files changed, 139 insertions, 3855 deletions.
- 제안 커밋 메시지: `chore: remove previous assignment files`
- 사용자 커밋 승인: 있음.

## 미해결 사항과 후속 작업

- 해당 사항 없음.
