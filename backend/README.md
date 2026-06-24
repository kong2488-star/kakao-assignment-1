# Kakao Assignment 3 Backend

FastAPI 기반 Todo 백엔드다. 초기 구조 단계에서는 앱 부팅과 헬스 체크만 제공하며, Todo CRUD와 SQLite 모델은 후속 Plan에서 구현한다.

## 실행

```bash
python -m venv .venv
python -m pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## 검증

```bash
ruff check .
pytest
```

## 구조와 의존성

- `main.py`: 초기 FastAPI 앱 진입점
- `tests/`: 백엔드 자동 테스트
- `FastAPI`, `Uvicorn`: REST API 서버
- `SQLAlchemy`, `SQLite`: 후속 Todo 영속성 구현을 위한 DB 계층
- `Pydantic`: 요청과 응답 스키마 검증
