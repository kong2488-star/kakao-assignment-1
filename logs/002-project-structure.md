# Harness Log: Project Structure

- Plan 번호: `002`
- Plan 경로: `plans/002-project-structure.md`
- 상태: `Completed`
- 시작일: `2026-06-24`
- 완료일: `2026-06-24`

## 작업 요약

- 승인된 Plan에 따라 `frontend/`와 `backend/`의 초기 프로젝트 구조를 생성하고 검증한다.

## 주요 결정과 근거

- 결정:
  - Next.js App Router와 FastAPI를 각각 독립 디렉터리로 구성한다.
  - 근거: 문서의 목표 아키텍처가 브라우저, Next.js API Route, FastAPI, SQLite의 책임 분리를 요구한다.
- 결정:
  - Next.js는 15 계열의 최신 패치 버전으로 고정하고 FastAPI/Pydantic은 Python 3.14 호환 버전으로 고정한다.
  - 근거: 최초 설치 시 `next@15.1.4` 보안 경고와 `pydantic-core`의 Python 3.14 빌드 실패가 발생했다.
- 결정:
  - `axios`와 `eslint`는 npm audit이 제안한 패치 버전으로 고정한다.
  - 근거: 직접 의존성 취약 경고를 후속 기능 구현 전에 제거하기 위함이다.

## 변경 파일

- `frontend/`: Next.js App Router 기반 초기 구조, 설정, README, 환경 예시, 예약 라우트 추가
- `backend/`: FastAPI 초기 앱, pytest, Ruff 설정, 요구사항, README, 환경 예시 추가
- `scripts/verify-before-commit.ps1`: Windows 실행 정책과 로컬 가상환경을 고려해 `npm.cmd`와 `.venv` 도구를 우선 사용하도록 조정
- `plans/002-project-structure.md`: 승인과 진행 상태 기록
- `logs/002-project-structure.md`: 작업 진행 기록 생성

## 의미 있는 명령과 결과

- `python -m venv .venv`
  - 결과: 성공. 백엔드 검증용 가상환경을 생성했다.
- `npm install`
  - 결과: 실패. PowerShell 실행 정책 때문에 `npm.ps1` 실행이 차단되었다.
- `.\.venv\Scripts\python -m pip install -r requirements.txt`
  - 결과: 실패. 기존 Pydantic 핀이 Python 3.14에서 지원되지 않는 PyO3 조합을 빌드하려 했다.
- `npm.cmd install`
  - 결과: 성공. 최초 `package-lock.json`을 생성했으나 취약 Next.js 버전 경고가 발생했다.
- `pip index versions pydantic`, `pip index versions fastapi`, `pip index versions SQLAlchemy`
  - 결과: 성공. Python 3.14 호환을 위해 업데이트 가능한 패키지 버전을 확인했다.
- `npm.cmd audit --json`
  - 결과: 실패 종료. 직접 수정 가능한 `axios`, `eslint` 취약 경고와 Next.js 내부 PostCSS 경고를 확인했다.
- `npm.cmd install`
  - 결과: 성공. `axios`, `eslint` 패치 버전을 반영해 lock 파일을 갱신했다. Next.js 내부 PostCSS audit 경고 2건은 남았다.
- `npm.cmd run lint`
  - 결과: 성공.
- `npm.cmd run format:check`
  - 결과: 최초 실패 후 Prettier 적용, 재실행 성공.
- `npm.cmd run typecheck`
  - 결과: 성공.
- `npm.cmd run build`
  - 결과: 성공. Next.js production build가 완료되었다.
- `.\.venv\Scripts\python -m ruff check .`
  - 결과: 성공.
- `.\.venv\Scripts\python -m pytest`
  - 결과: 성공. 1개 테스트 통과, FastAPI TestClient의 `httpx2` 전환 관련 deprecation warning 1건 발생.
- `powershell -ExecutionPolicy Bypass -File .\scripts\verify-before-commit.ps1 -Phase PreStage`
  - 결과: 실패. Git이 상위 저장소 `C:/Users/User`를 dubious ownership으로 차단했다.
- `git init -b week03-eojin`
  - 결과: 성공. `kakao-assignment-3` 안에 로컬 Git 저장소를 생성했다.
- `git config --global --add safe.directory C:/Users/User/Desktop/kakao-assignment-1/kakao-assignment-3`
  - 결과: 성공. 프로젝트 폴더 하나만 Git safe.directory로 등록했다.
- `powershell -ExecutionPolicy Bypass -File .\scripts\verify-before-commit.ps1 -Phase PreStage`
  - 결과: 실패. ESLint가 `.next` 생성물과 `next-env.d.ts` 자동 생성 선언을 검사했다.
- `powershell -ExecutionPolicy Bypass -File .\scripts\verify-before-commit.ps1 -Phase PreStage`
  - 결과: 실패. 프론트엔드 검증과 백엔드 Ruff는 통과했으나 `pytest.exe` 진입점에서 `main` 모듈 import에 실패했다.
- `powershell -ExecutionPolicy Bypass -File .\scripts\verify-before-commit.ps1 -Phase PreStage`
  - 결과: 성공. 프론트엔드 lint, format check, typecheck, production build와 백엔드 Ruff, pytest가 모두 통과했다.
- `powershell -ExecutionPolicy Bypass -File .\scripts\verify-before-commit.ps1 -Phase Staged`
  - 결과: 실패. PowerShell 환경에서 한글 상태 키 패턴이 안정적으로 매칭되지 않아 Completed 상태를 찾지 못했다.
- `powershell -ExecutionPolicy Bypass -File .\scripts\verify-before-commit.ps1 -Phase Staged`
  - 결과: 성공. staged diff whitespace, Markdown 링크, 필수 구조, Plan/log 매칭, 금지 파일과 민감정보 검사를 통과했다.

## 실패와 해결

- 실패:
  - PowerShell 실행 정책으로 `npm install`이 `npm.ps1`에서 차단되었다.
  - 원인: 시스템 실행 정책이 PowerShell 스크립트 실행을 제한했다.
  - 해결: `npm.cmd install`을 사용한다.
- 실패:
  - `pydantic-core` 빌드가 Python 3.14에서 실패했다.
  - 원인: 기존 `pydantic==2.10.4`가 사용하는 PyO3 버전이 Python 3.14를 지원하지 않았다.
  - 해결: Pydantic과 FastAPI 핀을 Python 3.14 호환 최신 라인으로 올린다.
- 실패:
  - `PreStage` 검증 스크립트가 Git dubious ownership 오류로 실패했다.
  - 원인: 현재 Git 저장소 루트가 `C:/Users/User`로 감지되고, 샌드박스 사용자와 소유자가 달라 Git 안전장치가 동작했다.
  - 해결: 영구적인 broad `safe.directory` 설정은 승인되지 않아 적용하지 않았다. 사용자가 명시적으로 승인하면 Git 기반 게이트를 재실행할 수 있다.
- 실패:
  - 새 로컬 저장소에서 `PreStage` 실행 시 `eslint .`가 `.next` 빌드 산출물을 검사했다.
  - 원인: ESLint flat config에 생성물 ignore가 명시되지 않았다.
  - 해결: `.next`, `node_modules`, 빌드 산출물, `next-env.d.ts`를 lint ignore에 추가했다.
- 실패:
  - `PreStage` 실행 시 백엔드 pytest가 `ModuleNotFoundError: No module named 'main'`으로 실패했다.
  - 원인: escalated 환경의 `pytest.exe` 진입점에서 작업 디렉터리가 import 경로에 안정적으로 포함되지 않았다.
  - 해결: 검증 스크립트가 가상환경 `python.exe -m pytest`와 `python.exe -m ruff`를 실행하도록 조정했다.
- 실패:
  - `Staged` 검증이 Plan과 로그의 `Completed` 상태를 찾지 못해 실패했다.
  - 원인: PowerShell 실행 환경에서 한글 키를 포함한 정규식 비교가 안정적으로 동작하지 않았다.
  - 해결: 상태 줄의 키 이름은 언어와 무관하게 두고 값이 `Completed`인지 확인하도록 정규식을 조정했다.

## 검증 결과

- PreStage 검증: 성공. 프론트엔드와 백엔드 필수 검증이 모두 통과했다.
- Staged 검증: 성공. staged diff whitespace, Markdown 링크, 필수 구조, Plan/log 매칭, 금지 파일과 민감정보 검사를 통과했다.
- 자동 테스트: `.\.venv\Scripts\python -m pytest` 성공. 1개 테스트 통과, deprecation warning 1건. PreStage에서도 1개 테스트 통과, cache warning 2건.
- 정적 검사: `npm.cmd run lint`, `npm.cmd run format:check`, `npm.cmd run typecheck`, `.\.venv\Scripts\python -m ruff check .` 모두 성공. PreStage에서도 모두 통과했다.
- 빌드: `npm.cmd run build` 성공. PreStage에서도 production build 통과.
- 수동 검증: 생성된 `frontend/`, `backend/` 구조가 `docs/ARCHITECTURE.md`의 목표 구조와 일치하는지 확인했다.
- 실행하지 못한 검증과 이유: 없음. Staged 검증은 stage 후 실행한다.

## 커밋 준비

- 현재 브랜치: `week03-eojin`
- staged 파일: 44개. `AGENTS.md`, `docs/`, `scripts/`, `backend/`, `frontend/`, `plans/002-project-structure.md`, `logs/002-project-structure.md`, `plans/TEMPLATE.md`, `logs/TEMPLATE.md`
- staged diff 요약: 44 files changed, 8366 insertions. Next.js/FastAPI 초기 구조, 검증 스크립트, 작업 Plan/log와 공통 문서가 포함된다.
- 제안 커밋 메시지: `chore: scaffold week03 project structure`
- 사용자 커밋 승인: 사용자가 커밋 실행을 요청했다.

## 미해결 사항과 후속 작업

- `npm audit --omit=dev` 기준 Next.js 내부 PostCSS 관련 moderate 경고 2건이 남아 있다. audit의 자동 수정 제안은 Next.js 9.3.3 다운그레이드라 적용하지 않았다.
