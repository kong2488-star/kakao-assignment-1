# 백엔드 규칙

## 기술과 구조

- FastAPI 0.111 이상, Uvicorn, SQLAlchemy, SQLite, Pydantic 2를 사용한다.
- 초기에는 앱, DB, 모델, 스키마, 라우터를 `main.py` 단일 파일에 둔다.
- 파일이 지나치게 커지거나 도메인이 추가될 때만 역할별 모듈 분리를 고려한다.
- 요청 및 응답 Pydantic 스키마를 SQLAlchemy 모델과 구분한다.
- DB 세션은 요청 단위 의존성으로 열고 항상 닫는다.
- 모든 DB 조회와 정렬 조건을 명시적으로 작성한다.

## DB와 시간

- SQLite 테이블은 애플리케이션 시작 시 SQLAlchemy `create_all`로 자동 생성한다.
- 초기 버전에는 Alembic을 도입하지 않는다.
- 날짜는 한국 표준시 기준의 `YYYY-MM-DD`로 처리한다.
- datetime은 한국 표준시의 timezone-aware 값으로 생성하고 `+09:00` 오프셋을 유지한다.

```dotenv
# backend/.env.local
DATABASE_URL=sqlite:///./todos.db
```

- 실제 `.env.local`과 `todos.db`는 커밋하지 않는다.
- `.env.example`을 제공한다.
- 기본 로컬 포트는 `8000`이다.
- 테스트는 운영 DB와 분리된 임시 SQLite DB를 사용한다.

## 구현 품질

- Pydantic 2 문법을 사용한다.
- 제목은 공백 제거 후 1자 이상 200자 이하로 검증한다.
- 존재하지 않는 Todo는 `404`로 처리한다.
- 예상 가능한 입력 오류에는 적절한 `4xx`를 반환한다.
- 내부 예외나 민감한 정보를 응답에 노출하지 않는다.
- Ruff 규칙을 코드에서 임의로 우회하지 않는다.
