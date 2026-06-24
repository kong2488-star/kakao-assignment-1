# Harness Log: Server Actions Export Troubleshooting

- Plan 번호: `005`
- Plan 경로: `plans/005-server-actions-export-troubleshooting.md`
- 상태: `Completed`
- 시작일: `2026-06-24`
- 완료일: `2026-06-24`

## 작업 요약

- `"use server"` 파일에서 객체를 export해 발생한 Next.js Runtime Error를 `docs/TROUBLESHOOTING.md`에 기록했다.
- 실제 코드 수정은 직전 프론트엔드 통합 커밋에 포함된 최종 상태를 기준으로 확인했다.

## 주요 결정과 근거

- 결정:
  - `actions.ts`는 async Server Action 함수만 export한다.
  - 근거: Next.js는 `"use server"` 파일에서 async function 외 export를 허용하지 않는다.
- 결정:
  - 폼 초기 상태는 각 client component 내부에 둔다.
  - 근거: 변경 범위가 작고 Server Actions 파일과 client state의 책임이 명확하다.

## 변경 파일

- `docs/TROUBLESHOOTING.md`: 실제 발생한 `"use server"` export 오류와 해결 방법 기록
- `plans/005-server-actions-export-troubleshooting.md`: 승인된 작업 계획 기록
- `logs/005-server-actions-export-troubleshooting.md`: 작업 이력과 검증 결과 기록

## 의미 있는 명령과 결과

- `npm.cmd run typecheck`
  - 결과: 성공.
- `npm.cmd run build`
  - 결과: 성공. Next.js production build 통과.
- `npm.cmd run lint`
  - 결과: 성공.
- `npm.cmd run format:check`
  - 결과: 성공.

## 실패와 해결

- 실패:
  - `/todos/new` 접근 시 `A "use server" file can only export async functions, found object.` Runtime Error가 발생했다.
  - 원인: `"use server"` 파일인 `actions.ts`에서 `emptyState` 객체를 export했다.
  - 해결: `actions.ts`에서 async function 외 export를 제거하고 폼 초기 상태를 client component로 이동했다.

## 검증 결과

- PreStage 검증: 성공.
- Staged 검증: 성공.
- 자동 테스트: 이번 변경은 프론트엔드 런타임 export 오류 수정과 문서 추가라 별도 자동 테스트는 실행하지 않았다.
- 정적 검사: `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run format:check` 성공.
- 빌드: `npm.cmd run build` 성공.
- 수동 검증: 실행하지 않았다.
- 실행하지 못한 검증과 이유: `/todos/new` 브라우저 재접속 확인은 사용자가 직접 실행 중 발견한 문제를 문서화하는 범위라 수행하지 않았다.

## 커밋 준비

- 현재 브랜치: `week03-eojin`
- staged 파일: `docs/TROUBLESHOOTING.md`, `plans/005-server-actions-export-troubleshooting.md`, `logs/005-server-actions-export-troubleshooting.md`
- staged diff 요약: 3 files changed, 181 insertions.
- 제안 커밋 메시지: `docs: record server actions troubleshooting`
- 사용자 커밋 승인: 없음.

## 미해결 사항과 후속 작업

- 해당 사항 없음.
