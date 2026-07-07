# Harness Log: PostgreSQL Migration

- Plan 번호: `008`
- Plan 경로: `plans/008-postgresql-migration.md`
- 상태: `Completed`
- 시작일: `2026-07-06`
- 완료일: `2026-07-06`

## 작업 요약

- Todo 백엔드의 SQLite 연결을 PostgreSQL과 Psycopg 3 연결로 전환했다.
- Docker Compose에 영구 개발 DB와 격리된 테스트 DB를 구성했다.
- 기존 API 테스트를 실제 PostgreSQL 테스트 DB에서 실행하도록 변경했다.

## 주요 결정과 근거

- 결정: 로컬, 테스트와 운영에서 PostgreSQL을 사용하고 테스트 DB를 별도 서비스로 격리한다.
  - 근거: 환경별 SQL 방언 차이를 제거하고 테스트가 개발 데이터를 변경하지 않게 한다.
- 결정: 기존 `create_all()` 테이블 초기화 방식은 유지한다.
  - 근거: 승인 범위에서 Alembic 도입이 제외됐다.

## 변경 파일

- `compose.yaml`: PostgreSQL 개발·테스트 서비스와 개발 데이터 volume 구성
- `backend/main.py`: PostgreSQL URL 필수 검증과 엔진 구성
- `backend/tests/test_main.py`: 전용 `todo_test` DB 검증, 테이블 격리와 정리
- `backend/requirements.txt`: Psycopg 3 binary 드라이버 고정
- `backend/.env.example`, `backend/README.md`: 환경변수와 실행 방법 갱신
- `AGENTS.md`, `docs/`: 아키텍처, API, 백엔드와 테스트 계약 갱신
- `plans/008-postgresql-migration.md`, `logs/008-postgresql-migration.md`: 승인 계획과 작업 기록

## 의미 있는 명령과 결과

- `docker compose config`
  - 결과: 성공. 개발·테스트 서비스, health check와 named volume 구성을 확인했다.
- `python -m pip install "psycopg[binary]==3.3.4"`
  - 결과: 권한 승인 후 성공. Python 3.14 호환 binary wheel을 설치했다.
- `docker compose up -d postgres postgres-test`
  - 결과: Docker Desktop 시작 후 성공. 두 컨테이너 모두 healthy 상태를 확인했다.
- `python -m ruff check .`
  - 결과: 성공.
- `python -m pytest`
  - 결과: PostgreSQL `todo_test` DB에서 17개 테스트 통과, 기존 TestClient deprecation warning 1건.
- Uvicorn 로컬 서버 CRUD 검증
  - 결과: `/health`, Todo 생성·목록·완료 수정·삭제 성공.
- `npm.cmd run lint`, `format:check`, `typecheck`, `build`
  - 결과: 모두 성공. Next.js production build 완료.

## 실패와 해결

- 실패: 샌드박스 네트워크에서 Psycopg 다운로드가 차단됐다.
  - 원인: 패키지 인덱스에 대한 네트워크 접근 제한.
  - 해결: 승인된 외부 실행으로 동일한 고정 버전을 설치했다.
- 실패: 첫 Docker 실행에서 Docker 엔진에 연결할 수 없었다.
  - 원인: Docker Desktop이 실행되지 않은 상태였다.
  - 해결: Docker Desktop을 백그라운드로 시작하고 두 PostgreSQL 서비스를 기동했다.
- 실패: 지연 import 블록이 Ruff `I001`, `E402`를 보고했다.
  - 원인: 테스트 DB URL을 검증한 뒤 `main`을 import해야 하는 테스트 초기화 순서.
  - 해결: import를 Ruff 정렬 기준에 맞게 분리하고 지연 import 이유에 해당하는 예외 표기를 적용했다.

## 검증 결과

- PreStage 검증: 성공
- Staged 검증: 성공
- 자동 테스트: PostgreSQL에서 17개 통과
- 정적 검사: 백엔드 Ruff, 프런트엔드 lint·format check·typecheck 통과
- 빌드: Next.js production build 통과
- 수동 검증: Uvicorn `/health`와 Todo CRUD 통과
- 실행하지 못한 검증과 이유: 없음

## 커밋 준비

- 현재 브랜치: `week03-eojin`
- staged 파일: 승인 범위의 코드·설정·문서와 Plan·로그 13개 파일
- staged diff 요약: 13 files changed, 257 insertions, 31 deletions
- 제안 커밋 메시지: `feat: migrate todo storage to postgresql`
- 사용자 커밋 승인: 없음

## 미해결 사항과 후속 작업

- 기존 FastAPI TestClient deprecation warning 1건은 이번 DB 전환 범위 밖이라 유지한다.
