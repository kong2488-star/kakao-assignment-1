# Plan: PostgreSQL Migration

- 번호: `008`
- 상태: `Completed`
- 생성일: `2026-07-06`
- 승인일: `2026-07-06`
- 완료일: `2026-07-06`
- 대응 로그: `logs/008-postgresql-migration.md`

## 1. 목표

Todo 백엔드의 영속성 계층을 SQLite에서 PostgreSQL로 전환하고 로컬, 테스트, 운영 환경에서 같은 데이터베이스 방언을 사용한다.

## 2. 범위

### 포함

- Psycopg 3 드라이버와 PostgreSQL 연결 설정 추가
- Docker Compose 개발 DB와 테스트 DB 구성
- pytest를 전용 PostgreSQL 테스트 DB로 전환
- 환경 예시, 실행 문서와 아키텍처 문서 갱신

### 제외

- 기존 `todos.db` 데이터 이전 또는 삭제
- Alembic 도입
- Todo API, 모델 필드와 프론트엔드 동작 변경
- 특정 배포 사업자에 종속된 설정

## 3. 구현 계획

- `psycopg[binary]==3.3.4`를 고정 의존성으로 추가한다.
- 애플리케이션은 `DATABASE_URL`, 테스트는 `TEST_DATABASE_URL`을 필수로 사용하고 PostgreSQL 연결만 허용한다.
- `postgres:17-alpine` 기반 개발 DB와 테스트 DB를 `compose.yaml`에 분리하며 개발 DB만 named volume으로 보존한다.
- 테스트 DB 이름을 `todo_test`로 검증하고 각 테스트 전후 테이블을 재생성한다.
- SQLite를 전제로 한 환경 예시, README, 공통·아키텍처·백엔드·API·테스트 문서를 PostgreSQL 기준으로 갱신한다.

## 4. API·타입 변경

- HTTP API와 Todo 요청·응답 타입 변경 없음.
- 실행 환경변수 `DATABASE_URL`은 `postgresql+psycopg://...` URL을 요구한다.
- 테스트 환경변수 `TEST_DATABASE_URL`은 데이터베이스 이름이 `todo_test`인 `postgresql+psycopg://...` URL을 요구한다.

## 5. 테스트 계획

- `docker compose config`
- 개발·테스트 PostgreSQL 컨테이너 health 확인
- `backend/.venv/Scripts/python -m ruff check .`
- `backend/.venv/Scripts/python -m pytest`
- 개발 DB에서 FastAPI `/health`와 Todo CRUD 수동 검증
- 프론트엔드 lint, format check, typecheck, production build
- `scripts/verify-before-commit.ps1`의 PreStage와 Staged 검증

## 6. 완료 기준

- [x] 구현 항목이 승인된 범위와 일치한다.
- [x] PostgreSQL 전용 테스트 DB에서 자동 테스트가 통과한다.
- [x] 필수 정적 검증과 빌드가 통과한다.
- [x] 관련 문서가 현재 구현과 일치한다.
- [x] 대응 하네스 로그의 요약과 검증 결과가 완성되었다.
- [x] 커밋 전 `PreStage`와 `Staged` 검증이 통과했다.
- [x] staged 파일과 제안 커밋 메시지를 사용자에게 제시할 준비를 완료했다.

## 진행 기록

- `2026-07-06`: 사용자가 PostgreSQL 전환 계획을 승인해 Plan을 `In Progress`로 시작했다.
- `2026-07-06`: PostgreSQL 전환, 문서 갱신, 자동·수동 검증과 PreStage 게이트를 완료했다.
- `2026-07-06`: 승인 범위의 13개 파일만 stage하고 Staged 게이트를 통과했다.
