# Kakao Assignment 3 Backend

FastAPI, SQLAlchemy와 PostgreSQL 기반 Todo 백엔드다. Todo CRUD 데이터는 PostgreSQL에 저장하며 개발 DB와 테스트 DB를 분리한다.

## 실행

```bash
cd ..
docker compose up -d postgres postgres-test
cd backend
cp .env.example .env.local
python -m venv .venv
python -m pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

PowerShell에서는 환경 파일을 다음과 같이 복사할 수 있다.

```powershell
Copy-Item .env.example .env.local
```

`DATABASE_URL`은 애플리케이션 DB, `TEST_DATABASE_URL`은 이름이 `todo_test`인 테스트 전용 DB를 가리켜야 한다. 배포 환경의 `postgresql://` URL과 명시적인 `postgresql+psycopg://` URL을 모두 지원한다.

## 검증

```bash
ruff check .
pytest
```

## 구조와 의존성

- `main.py`: FastAPI 앱, SQLAlchemy 모델과 Todo REST API
- `tests/`: 백엔드 자동 테스트
- `FastAPI`, `Uvicorn`: REST API 서버
- `SQLAlchemy`, `PostgreSQL`, `Psycopg 3`: Todo 영속성 계층과 DB 드라이버
- `Pydantic`: 요청과 응답 스키마 검증

테이블은 현재 애플리케이션 시작 시 `create_all()`로 생성한다. 기존 SQLite 데이터는 PostgreSQL로 이전하지 않으며, 스키마 마이그레이션 도구는 아직 사용하지 않는다.
