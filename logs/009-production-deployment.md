# Harness Log: Production Deployment

- Plan 번호: `009`
- Plan 경로: `plans/009-production-deployment.md`
- 상태: `Completed`
- 시작일: `2026-07-07`
- 완료일: `2026-07-07`

## 작업 요약

- Render 표준 PostgreSQL URL을 Psycopg 3 URL로 정규화하도록 백엔드를 보완했다.
- `main` 대상 Render Blueprint와 Python 버전 고정 설정을 추가했다.
- Render·Vercel 계정 생성부터 공개 서비스 검증까지 배포 절차를 문서화했다.

## 주요 결정과 근거

- 결정: 구현은 `week03-eojin`, 운영 배포는 PR 병합 후 `main`을 사용한다.
  - 근거: 저장소 브랜치 규칙을 지키면서 운영 브랜치를 `main`으로 일원화한다.
- 결정: Render Web Service와 PostgreSQL을 Singapore 리전에 함께 배치한다.
  - 근거: 한국 사용자와 DB 내부 연결의 지연을 줄인다.

## 변경 파일

- `backend/main.py`, `backend/tests/test_main.py`: DB URL 정규화와 테스트 추가
- `backend/.python-version`: Render Python 3.14 계열 고정
- `render.yaml`: `main` 기반 Render Web Service와 PostgreSQL Blueprint
- `docs/DEPLOYMENT.md`: Render·Vercel 운영 배포 및 사용자 체크포인트
- `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/BACKEND.md`, `backend/README.md`: 배포 문서와 DB URL 정책 반영
- `plans/009-production-deployment.md`, `logs/009-production-deployment.md`: 승인 계획과 작업 기록

## 의미 있는 명령과 결과

- `gh auth status`
  - 결과: 사용자 계정 컨텍스트에서 GitHub 인증 성공.
- `docker compose config`
  - 결과: 성공. 로컬 개발·테스트 PostgreSQL 구성 유효.
- `python -m ruff check .`
  - 결과: 성공.
- `python -m pytest`
  - 결과: PostgreSQL `todo_test` DB에서 20개 테스트 통과, 기존 TestClient deprecation warning 1건.
- `npm.cmd exec -- prettier --check ../render.yaml ../docs/DEPLOYMENT.md`
  - 결과: 성공. Blueprint와 배포 문서 포맷 확인.
- `npm.cmd run lint`, `format:check`, `typecheck`, `build`
  - 결과: 모두 성공. Next.js production build 완료.
- `scripts/verify-before-commit.ps1 -Phase PreStage`
  - 결과: 성공. 프런트엔드·백엔드 전체 검증 통과.

## 실패와 해결

- 실패: 샌드박스 계정에서는 새 GitHub CLI 인증을 확인할 수 없었다.
  - 원인: 사용자 계정과 샌드박스 계정의 자격 증명 저장소가 분리돼 있다.
  - 해결: 승인된 사용자 계정 컨텍스트에서 인증 상태를 확인했다.
- 실패: Docker 엔진이 꺼져 PostgreSQL 테스트 준비가 중단됐다.
  - 원인: Docker Desktop이 실행되지 않은 상태였다.
  - 해결: Docker Desktop을 백그라운드로 시작하고 개발·테스트 서비스를 재기동했다.

## 검증 결과

- PreStage 검증: 성공
- Staged 검증: 성공
- 자동 테스트: PostgreSQL에서 20개 통과
- 정적 검사: 백엔드 Ruff, 프런트엔드 lint·format check·typecheck 통과
- 빌드: Next.js production build 통과
- 수동 검증: Render Blueprint와 배포 문서 포맷 확인
- 실행하지 못한 검증과 이유: 실제 공개 배포는 PR 병합과 사용자 계정 설정 후 확인

## 커밋 준비

- 현재 브랜치: `week03-eojin`
- staged 파일: 승인 범위의 코드·설정·문서와 Plan·로그 11개 파일
- staged diff 요약: DB URL 정규화, Render Blueprint, Python 버전 고정과 운영 배포 문서 추가
- 제안 커밋 메시지: `chore: prepare main production deployment`
- 사용자 커밋 승인: `2026-07-07` 승인

## 미해결 사항과 후속 작업

- Render·Vercel 배포는 PR 병합과 사용자 계정 설정 후 진행한다.
