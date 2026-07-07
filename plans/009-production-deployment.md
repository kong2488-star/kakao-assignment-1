# Plan: Production Deployment

- 번호: `009`
- 상태: `Completed`
- 생성일: `2026-07-07`
- 승인일: `2026-07-07`
- 완료일: `2026-07-07`
- 대응 로그: `logs/009-production-deployment.md`

## 1. 목표

`main` 브랜치를 기준으로 Next.js 프론트엔드를 Vercel에, FastAPI와 PostgreSQL을 Render Singapore 리전에 배포할 수 있도록 저장소 설정과 절차를 준비한다.

## 2. 범위

### 포함

- Render PostgreSQL 연결 URL 정규화와 테스트
- Render Blueprint와 Python 버전 고정
- `main` 운영 배포 절차 문서화
- 전체 검증, `week03-eojin` push와 `main` 대상 Pull Request 준비

### 제외

- 기존 SQLite 데이터 이전
- 개인 도메인 연결
- 유료 Render 리소스 전환
- 사용자의 Render·Vercel 계정 생성과 대시보드 승인 대행

## 3. 구현 계획

- `postgresql://`과 `postgresql+psycopg://` URL을 모두 받아 Psycopg 3 URL로 정규화하고 다른 DB 방언은 거부한다.
- `backend/.python-version`으로 Python 3.14 계열을 고정한다.
- 루트 `render.yaml`에 `main` 브랜치의 무료 FastAPI Web Service와 PostgreSQL 17 리소스를 선언한다.
- Render와 Vercel의 사용자 체크포인트, 환경변수와 검증 절차를 배포 문서에 기록한다.
- 검증 후 승인된 파일만 stage하고 커밋·push 승인을 받는다.

## 4. API·타입 변경

- HTTP API와 Todo 타입 변경 없음.
- `DATABASE_URL`은 `postgresql://` 또는 `postgresql+psycopg://`를 허용하며 내부적으로 Psycopg 3 URL로 정규화한다.

## 5. 테스트 계획

- PostgreSQL URL 정규화와 잘못된 URL 거부 테스트
- PostgreSQL `todo_test` DB에서 pytest 전체 실행
- 백엔드 Ruff
- 프런트엔드 lint, format check, typecheck와 production build
- Render Blueprint 구조 점검
- PreStage·Staged 검증
- 배포 후 Render `/health`와 Vercel Todo CRUD 수동 검증

## 6. 완료 기준

- [x] 구현 항목이 승인된 범위와 일치한다.
- [x] 관련 자동 테스트가 통과한다.
- [x] 필수 정적 검증과 빌드가 통과한다.
- [x] 관련 문서가 현재 구현과 일치한다.
- [x] 대응 하네스 로그의 요약과 검증 결과가 완성되었다.
- [x] 커밋 전 `PreStage`와 `Staged` 검증이 통과했다.
- [x] staged 파일과 제안 커밋 메시지를 사용자에게 제시할 준비를 완료했다.

## 진행 기록

- `2026-07-07`: 사용자가 `main` 운영 배포 계획을 승인해 Plan을 `In Progress`로 시작했다.
- `2026-07-07`: 배포 설정·문서 구현과 로컬 검증, PreStage 게이트를 완료했다.
- `2026-07-07`: 승인 범위의 11개 파일만 stage하고 Staged 게이트를 통과했다.
