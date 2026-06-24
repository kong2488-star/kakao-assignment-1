# AGENTS.md

## 목적과 범위

이 문서는 `kakao-assignment-3`에서 작업하는 개발자와 코딩 에이전트가 항상 따라야 할 최상위 기준이다.

- 기존 `../kakao-assignment-1`은 동작과 디자인을 확인하기 위한 참고 자료로만 사용한다.
- 기존 프로젝트의 파일은 수정하거나 이동하지 않는다.
- 새 구현과 문서 변경은 `kakao-assignment-3` 안에서만 진행한다.
- 기존 Todo 기능과 보라색 계열 디자인을 우선 보존한다.
- 요구되지 않은 기능 확장, 대규모 디자인 변경, 불필요한 추상화를 하지 않는다.
- 구조를 변경하거나 새 의존성을 추가할 때는 필요성과 이유를 README에 기록한다.

## 필수 문서 읽기

작업을 시작하기 전에 공통 문서와 작업 영역의 문서를 읽는다.

- 코드 변경이 포함된 모든 작업: [Plan 운영 규칙](docs/PLANNING.md)
- 코드 변경의 과정과 검증 기록: [하네스 작업 로그](docs/HARNESS_LOGGING.md)
- Git 작업과 커밋: [Git 작업 규칙](docs/GIT_WORKFLOW.md)
- 커밋 전 필수 검증: [커밋 전 검증 게이트](docs/PRE_COMMIT_VALIDATION.md)
- 모든 작업: [아키텍처](docs/ARCHITECTURE.md)
- 데이터 모델 또는 API 작업: [API 계약](docs/API.md)
- Next.js, UI 또는 프록시 작업: [프론트엔드 규칙](docs/FRONTEND.md)
- FastAPI, DB 또는 Python 작업: [백엔드 규칙](docs/BACKEND.md)
- 구현 및 변경 검증: [테스트와 실행](docs/TESTING.md)

여러 영역에 걸친 작업이면 관련 문서를 모두 읽는다. 문서 간 내용이 충돌하면 이 파일의 불변 규칙을 우선하고, 상세 문서끼리 충돌하면 더 구체적인 작업 영역 문서를 우선한다.

## Plan 우선 원칙

- 소스, 설정, 테스트, 의존성 또는 코드 생성 결과를 변경하기 전에 작업별 Plan 문서를 작성한다.
- Plan은 [표준 템플릿](plans/TEMPLATE.md)을 복사해 `plans/NNN-english-kebab-case-title.md`로 저장한다.
- Plan이 `Draft`인 동안에는 읽기, 검색, 분석 등 비수정 작업만 수행한다.
- 사용자의 명시적 승인 전에는 코드 변경을 시작하지 않는다.
- 구현 시작 시 Plan과 동일한 번호·제목의 하네스 로그를 `logs/`에 생성하고 작업 중 수시로 갱신한다.
- 승인받은 범위나 주요 설계가 달라지면 구현을 멈추고 Plan을 수정한 뒤 재승인받는다.
- 문서와 주석만 변경하며 코드 동작에 영향을 주지 않는 작업은 별도 Plan 없이 진행할 수 있다.
- 상세한 상태 전환과 예외 기준은 [Plan 운영 규칙](docs/PLANNING.md)을 따른다.
- 로그의 기록 범위와 민감정보 처리 기준은 [하네스 작업 로그](docs/HARNESS_LOGGING.md)를 따른다.
- 커밋 전에는 `PreStage`와 `Staged` 검증을 모두 통과하고 별도의 사용자 승인을 받는다.
- `main`을 변경하지 않으며 모든 구현과 커밋은 `week03-eojin`에서만 수행한다.

## 핵심 아키텍처

```text
Browser
  → Next.js API Route (/api/todos)
  → FastAPI (BACKEND_API_URL)
  → SQLAlchemy
  → SQLite
```

- Frontend: Next.js 15+, App Router, React 18+, TypeScript 5, Tailwind CSS 4, Axios
- Backend: FastAPI 0.111+, Uvicorn, SQLAlchemy, SQLite, Pydantic 2
- 브라우저는 FastAPI를 직접 호출하지 않는다.
- Server Actions와 `actions.ts`는 사용하지 않는다.
- FastAPI CORS는 설정하지 않는다.
- 기존 `localStorage` 데이터는 이전하지 않는다.
- 날짜와 시각은 한국 표준시 정책을 따른다.

## 공통 작업 원칙

- 작업 전 관련 파일, 현재 구현, 승인된 Plan과 대응 하네스 로그를 읽는다.
- 기존 동작을 바꿀 때는 요구사항, 문서, 테스트를 함께 갱신한다.
- 한 변경에는 하나의 명확한 목적을 유지한다.
- 패키지는 서로 호환되는 안정 버전을 선택하고 lock 파일 또는 요구사항 파일에 고정한다.
- 생성된 빌드 결과물, 가상환경, 캐시, DB, 실제 환경 파일을 커밋하지 않는다.
- 요구사항이 모호하면 기존 동작 보존과 최소 변경을 기본값으로 삼는다.
- 완료 보고에는 변경 내용과 실행한 검증 결과를 포함한다.

## 완료 기준

- Frontend: lint, format check, TypeScript 검사, production build
- Backend: Ruff, pytest
- 대응 하네스 로그에 변경 요약과 실제 검증 결과가 기록되어야 한다.
- 필수 검증 실패 또는 미실행 상태에서는 커밋하지 않는다.
- 관련 검증을 실행할 수 없다면 이유와 실행하지 못한 항목을 명확하게 보고한다.
