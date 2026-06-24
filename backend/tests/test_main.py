from collections.abc import Iterator
from pathlib import Path
from tempfile import TemporaryDirectory
from time import sleep

import pytest
from fastapi.testclient import TestClient

from main import create_app


@pytest.fixture()
def client() -> Iterator[TestClient]:
    test_db_root = Path(".test-dbs")
    test_db_root.mkdir(exist_ok=True)
    with TemporaryDirectory(dir=test_db_root) as temp_dir:
        database_url = f"sqlite:///{Path(temp_dir) / 'test.db'}"
        app = create_app(database_url)
        with TestClient(app) as test_client:
            yield test_client
        app.state.engine.dispose()


def create_todo(
    client: TestClient,
    title: str = "할 일",
    due_date: str = "2026-06-24",
) -> dict[str, object]:
    response = client.post("/todos", json={"title": title, "due_date": due_date})
    assert response.status_code == 201
    return response.json()


def test_health_check(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_list_todos_empty(client: TestClient) -> None:
    response = client.get("/todos", params={"due_date": "2026-06-24"})

    assert response.status_code == 200
    assert response.json() == []


def test_create_todo_sets_defaults(client: TestClient) -> None:
    todo = create_todo(client, "회의 준비")

    assert todo["id"] == 1
    assert todo["title"] == "회의 준비"
    assert todo["completed"] is False
    assert todo["due_date"] == "2026-06-24"
    assert str(todo["created_at"]).endswith("+09:00")
    assert str(todo["updated_at"]).endswith("+09:00")


def test_create_todo_trims_title(client: TestClient) -> None:
    todo = create_todo(client, "  정리하기  ")

    assert todo["title"] == "정리하기"


@pytest.mark.parametrize("title", ["", "   "])
def test_create_todo_rejects_blank_title(client: TestClient, title: str) -> None:
    response = client.post(
        "/todos",
        json={"title": title, "due_date": "2026-06-24"},
    )

    assert response.status_code == 422


def test_create_todo_rejects_long_title(client: TestClient) -> None:
    response = client.post(
        "/todos",
        json={"title": "a" * 201, "due_date": "2026-06-24"},
    )

    assert response.status_code == 422


def test_create_todo_rejects_invalid_due_date(client: TestClient) -> None:
    response = client.post(
        "/todos",
        json={"title": "날짜 확인", "due_date": "2026-6-24"},
    )

    assert response.status_code == 422


def test_get_todo(client: TestClient) -> None:
    created = create_todo(client)

    response = client.get(f"/todos/{created['id']}")

    assert response.status_code == 200
    assert response.json()["id"] == created["id"]


def test_update_title_changes_updated_at(client: TestClient) -> None:
    created = create_todo(client, "기존 제목")
    sleep(0.01)

    response = client.patch(
        f"/todos/{created['id']}",
        json={"title": "  새 제목  "},
    )

    assert response.status_code == 200
    updated = response.json()
    assert updated["title"] == "새 제목"
    assert updated["updated_at"] > created["updated_at"]


def test_update_completed(client: TestClient) -> None:
    created = create_todo(client)

    response = client.patch(f"/todos/{created['id']}", json={"completed": True})

    assert response.status_code == 200
    assert response.json()["completed"] is True


def test_update_requires_title_or_completed(client: TestClient) -> None:
    created = create_todo(client)

    response = client.patch(f"/todos/{created['id']}", json={})

    assert response.status_code == 422


def test_delete_todo(client: TestClient) -> None:
    created = create_todo(client)

    delete_response = client.delete(f"/todos/{created['id']}")
    get_response = client.get(f"/todos/{created['id']}")

    assert delete_response.status_code == 204
    assert get_response.status_code == 404


def test_list_filters_by_due_date(client: TestClient) -> None:
    target = create_todo(client, "오늘", "2026-06-24")
    create_todo(client, "내일", "2026-06-25")

    response = client.get("/todos", params={"due_date": "2026-06-24"})

    assert response.status_code == 200
    assert [todo["id"] for todo in response.json()] == [target["id"]]


def test_list_filters_by_completed(client: TestClient) -> None:
    active = create_todo(client, "진행 중")
    completed = create_todo(client, "완료됨")
    client.patch(f"/todos/{completed['id']}", json={"completed": True})

    active_response = client.get(
        "/todos",
        params={"due_date": "2026-06-24", "completed": False},
    )
    completed_response = client.get(
        "/todos",
        params={"due_date": "2026-06-24", "completed": True},
    )

    assert [todo["id"] for todo in active_response.json()] == [active["id"]]
    assert [todo["id"] for todo in completed_response.json()] == [completed["id"]]


def test_list_orders_by_newest_created(client: TestClient) -> None:
    older = create_todo(client, "먼저")
    sleep(0.01)
    newer = create_todo(client, "나중")

    response = client.get("/todos", params={"due_date": "2026-06-24"})

    assert [todo["id"] for todo in response.json()] == [newer["id"], older["id"]]


def test_invalid_id_and_missing_id(client: TestClient) -> None:
    invalid_response = client.get("/todos/not-an-id")
    missing_response = client.get("/todos/999")

    assert invalid_response.status_code == 422
    assert missing_response.status_code == 404
