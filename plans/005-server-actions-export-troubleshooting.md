# Plan: Server Actions Export Troubleshooting

- 번호: `005`
- 상태: `Completed`
- 생성일: `2026-06-24`
- 승인일: `2026-06-24`
- 완료일: `2026-06-24`
- 대응 로그: `logs/005-server-actions-export-troubleshooting.md`

## 1. 목표

`"use server"` 파일에서 객체를 export해 발생한 Next.js Runtime Error의 원인과 해결 방법을 트러블슈팅 문서에 기록한다. 실제 코드 수정은 직전 프론트엔드 통합 커밋에 포함된 상태를 기준으로 한다.

## 2. 범위

### 포함

- `docs/TROUBLESHOOTING.md`에 이번 Runtime Error 원인과 해결 기록
- 대응 Plan과 하네스 로그 작성

### 제외

- Server Actions 구조 변경
- API Route 프록시 변경
- FastAPI 백엔드 변경
- 다른 미발생 오류의 트러블슈팅 항목 추가

## 3. 구현 계획

- 트러블슈팅 문서는 실제 증상, 원인, 해결, 확인 명령 중심으로 작성한다.
- 직전 커밋의 최종 코드 상태에서 `actions.ts`가 async Server Action 함수만 export하는지 확인한다.

## 4. API·타입 변경

- 공개 API 변경 없음.
- 타입 변경 없음.

## 5. 테스트 계획

- `cd frontend && npm.cmd run typecheck`
- `cd frontend && npm.cmd run build`
- `cd frontend && npm.cmd run lint`
- `cd frontend && npm.cmd run format:check`
- 수동으로 `/todos/new` 접근 시 Runtime Error가 사라졌는지 확인한다.

## 6. 완료 기준

- [x] `actions.ts`가 async Server Action 함수만 export한다.
- [x] 생성/수정 폼이 초기 action state를 정상 사용한다.
- [x] 트러블슈팅 문서가 실제 발생 문제만 기록한다.
- [x] frontend typecheck와 build가 통과한다.
- [x] 대응 하네스 로그의 요약과 검증 결과가 완성되었다.
- [x] 커밋 전 `PreStage`와 `Staged` 검증이 통과했다.
- [x] staged 파일과 제안 커밋 메시지를 사용자에게 제시했다.

## 진행 기록

- `2026-06-24`: 사용자 승인에 따라 Plan을 작성하고 In Progress로 시작했다.
- `2026-06-24`: Server Actions export 오류의 원인과 해결을 트러블슈팅 문서로 정리했다.
- `2026-06-24`: 004 커밋을 먼저 분리한 뒤 005 문서 변경만 staged 검증을 통과했다.
