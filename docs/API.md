# Todo 데이터와 REST API 계약

## Todo 모델

```ts
type Todo = {
  id: number;
  title: string;
  completed: boolean;
  due_date: string;
  created_at: string;
  updated_at: string;
};
```

필드 규칙:

- `id`: PostgreSQL에서 생성하는 양의 정수 기본 키
- `title`: 앞뒤 공백을 제거한 1자 이상 200자 이하 문자열
- `completed`: 생성 시 기본값 `false`
- `due_date`: 한국 날짜를 나타내는 `YYYY-MM-DD` 문자열
- `created_at`, `updated_at`: `+09:00` 오프셋을 포함한 한국 표준시
- `updated_at`은 실제 수정이 성공할 때 갱신한다.

요청 규칙:

- 생성 요청은 `title`, `due_date`만 받는다.
- 생성 요청에서 `id`, `completed`, `created_at`, `updated_at`을 지정하지 않는다.
- 일반 수정 요청은 `title`만 받는다.
- 완료 전환 요청은 `completed`만 변경한다.
- 프론트엔드와 백엔드 모두 입력을 검증하되 백엔드 검증을 최종 기준으로 삼는다.

## 엔드포인트

FastAPI:

```text
GET    /todos
POST   /todos
GET    /todos/{todo_id}
PATCH  /todos/{todo_id}
DELETE /todos/{todo_id}
```

Next.js 프록시:

```text
GET    /api/todos
POST   /api/todos
GET    /api/todos/{todoId}
PATCH  /api/todos/{todoId}
DELETE /api/todos/{todoId}
```

## 목록 조회

- `due_date=YYYY-MM-DD`로 날짜를 필터링한다.
- 완료 필터는 FastAPI에서 처리한다.
- 프론트엔드의 `status=active`는 `completed=false`로 변환한다.
- 프론트엔드의 `status=completed`는 `completed=true`로 변환한다.
- `status=all`은 완료 조건을 전달하지 않는다.
- 결과는 `created_at DESC` 최신 생성순으로 정렬한다.
- 페이지네이션은 적용하지 않는다.

## 응답 규칙

- 목록 조회 성공: `Todo[]`
- 생성, 단건 조회, 수정 성공: `Todo`
- 삭제 성공: `204 No Content`
- 존재하지 않는 정수 ID: `404 Not Found`
- 잘못된 경로나 입력값: 적절한 `4xx`
- 오류 응답은 FastAPI의 `detail` 형식을 기본으로 사용한다.
- 성공 응답을 `{ data: ... }` 형태로 감싸지 않는다.
- Next.js 프록시는 FastAPI의 상태 코드와 본문을 가능한 그대로 전달한다.
