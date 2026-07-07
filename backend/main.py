from collections.abc import Generator
from datetime import date, datetime, timedelta, timezone
from os import getenv
from typing import Annotated

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Query, Response, status
from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator
from sqlalchemy import Boolean, Date, DateTime, Integer, String, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker

KST = timezone(timedelta(hours=9))
POSTGRESQL_URL_PREFIX = "postgresql+psycopg://"


class Base(DeclarativeBase):
    pass


class Todo(Base):
    __tablename__ = "todos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    completed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    due_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )


def now_kst() -> datetime:
    return datetime.now(KST)


def normalize_datetime(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=KST)
    return value.astimezone(KST)


def parse_due_date(value: str) -> date:
    try:
        parsed = date.fromisoformat(value)
    except ValueError as exc:
        raise ValueError("due_date must use YYYY-MM-DD format.") from exc

    if parsed.isoformat() != value:
        raise ValueError("due_date must use YYYY-MM-DD format.")

    return parsed


def validate_title(value: str) -> str:
    title = value.strip()
    if not title:
        raise ValueError("title must contain at least 1 character.")
    if len(title) > 200:
        raise ValueError("title must be 200 characters or fewer.")
    return title


class TodoCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    due_date: str

    @field_validator("title")
    @classmethod
    def title_must_be_valid(cls, value: str) -> str:
        return validate_title(value)

    @field_validator("due_date")
    @classmethod
    def due_date_must_be_valid(cls, value: str) -> str:
        parse_due_date(value)
        return value


class TodoUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    completed: bool | None = None

    @field_validator("title")
    @classmethod
    def title_must_be_valid(cls, value: str | None) -> str | None:
        if value is None:
            return value
        return validate_title(value)

    @model_validator(mode="after")
    def at_least_one_field(self) -> "TodoUpdate":
        if self.title is None and self.completed is None:
            raise ValueError("title or completed is required.")
        return self


class TodoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    completed: bool
    due_date: date
    created_at: datetime
    updated_at: datetime

    @field_validator("created_at", "updated_at")
    @classmethod
    def datetime_must_be_kst(cls, value: datetime) -> datetime:
        return normalize_datetime(value)


def create_app(database_url: str | None = None) -> FastAPI:
    load_dotenv(".env.local")

    resolved_database_url = database_url or getenv("DATABASE_URL")
    if not resolved_database_url:
        raise RuntimeError("DATABASE_URL environment variable is required.")
    if not resolved_database_url.startswith(POSTGRESQL_URL_PREFIX):
        raise RuntimeError(
            "DATABASE_URL must use the postgresql+psycopg:// driver URL."
        )

    engine = create_engine(resolved_database_url)
    session_local = sessionmaker(bind=engine, autoflush=False, autocommit=False)

    Base.metadata.create_all(bind=engine)

    app = FastAPI(title="Kakao Todo API")
    app.state.engine = engine

    def get_db() -> Generator[Session, None, None]:
        db = session_local()
        try:
            yield db
        finally:
            db.close()

    DbSession = Annotated[Session, Depends(get_db)]

    def get_todo_or_404(db: Session, todo_id: int) -> Todo:
        todo = db.get(Todo, todo_id)
        if todo is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Todo not found.",
            )
        return todo

    @app.get("/health")
    def health_check() -> dict[str, str]:
        return {"status": "ok"}

    @app.get("/todos", response_model=list[TodoRead])
    def list_todos(
        db: DbSession,
        due_date: str = Query(...),
        completed: bool | None = Query(default=None),
    ) -> list[Todo]:
        try:
            parsed_due_date = parse_due_date(due_date)
        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=str(exc),
            ) from exc

        statement = select(Todo).where(Todo.due_date == parsed_due_date)
        if completed is not None:
            statement = statement.where(Todo.completed == completed)
        statement = statement.order_by(Todo.created_at.desc(), Todo.id.desc())

        return list(db.scalars(statement))

    @app.post("/todos", response_model=TodoRead, status_code=status.HTTP_201_CREATED)
    def create_todo(payload: TodoCreate, db: DbSession) -> Todo:
        current_time = now_kst()
        todo = Todo(
            title=payload.title,
            completed=False,
            due_date=parse_due_date(payload.due_date),
            created_at=current_time,
            updated_at=current_time,
        )
        db.add(todo)
        db.commit()
        db.refresh(todo)
        return todo

    @app.get("/todos/{todo_id}", response_model=TodoRead)
    def get_todo(todo_id: int, db: DbSession) -> Todo:
        return get_todo_or_404(db, todo_id)

    @app.patch("/todos/{todo_id}", response_model=TodoRead)
    def update_todo(todo_id: int, payload: TodoUpdate, db: DbSession) -> Todo:
        todo = get_todo_or_404(db, todo_id)
        if payload.title is not None:
            todo.title = payload.title
        if payload.completed is not None:
            todo.completed = payload.completed
        todo.updated_at = now_kst()
        db.commit()
        db.refresh(todo)
        return todo

    @app.delete("/todos/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
    def delete_todo(todo_id: int, db: DbSession) -> Response:
        todo = get_todo_or_404(db, todo_id)
        db.delete(todo)
        db.commit()
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    return app


app = create_app()
