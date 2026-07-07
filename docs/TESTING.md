# 실행과 검증

## 표준 명령

프로젝트가 구성되면 실제 `package.json`, `requirements.txt`, README를 아래 기준과 일치시킨다.

Frontend:

```bash
cd frontend
npm install
npm run dev
npm run lint
npm run format:check
npm run typecheck
npm run build
```

Backend:

```bash
docker compose up -d postgres postgres-test
cd backend
cp .env.example .env.local
python -m venv .venv
python -m pip install -r requirements.txt
uvicorn main:app --reload --port 8000
ruff check .
pytest
```

## 완료 전 검증

- Frontend: lint, format check, TypeScript 검사, production build
- Backend: Ruff, pytest
- 검증을 실행할 수 없다면 이유와 실행하지 못한 항목을 완료 보고에 포함한다.

## 커밋 전 검증

- 모든 커밋은 [커밋 전 검증 게이트](PRE_COMMIT_VALIDATION.md)를 따른다.
- 코드와 설정은 stage 전에 영향 영역의 전체 검증을 통과해야 한다.
- Plan과 하네스 로그를 완료한 뒤 staged 파일을 다시 감사한다.
- 필수 검증 실패 또는 미실행 상태에서는 커밋하지 않는다.

## Backend 자동 테스트

pytest는 개발·운영 DB와 분리된 `todo_test` PostgreSQL DB를 사용한다. 테스트는 각 테스트 전후 테이블을 재생성하며, `TEST_DATABASE_URL`이 `todo_test`가 아니면 데이터 보호를 위해 즉시 실패한다.

최소 테스트:

- 빈 목록 조회
- Todo 생성 및 기본값
- 제목 앞뒤 공백 제거
- 빈 제목과 200자 초과 제목 거부
- 단건 조회
- 제목 수정과 `updated_at` 갱신
- 완료 상태 전환
- 삭제 및 삭제 후 404
- 날짜 필터
- 완료 및 미완료 필터
- 최신 생성순 정렬
- 잘못된 ID와 존재하지 않는 ID 처리

## Frontend 수동 검증

- 루트 리다이렉트
- URL 날짜 및 상태 필터 보존
- 생성 및 수정 후 올바른 날짜 목록 이동
- 완료 전환
- 삭제 확인 및 취소
- 요청 중 중복 동작 방지
- 오류 발생 시 메시지와 입력값 보존
- 모바일 및 키보드 사용성
