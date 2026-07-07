# Troubleshooting

실제로 실행 중 겪은 문제만 기록한다. 새 항목은 증상, 원인, 해결, 확인 순서로 남긴다.

## `"use server"` 파일에서 객체를 export해 발생한 Runtime Error

### 상황

프론트엔드와 백엔드 서버를 실행한 뒤 `/todos/new` 화면에 접근하는 과정에서 발생했다.

### 증상

Next.js 런타임 에러 화면에 다음 메시지가 표시됐다.

```text
A "use server" file can only export async functions, found object.
```

에러 화면은 `app/todos/new/page.tsx`의 `<NewTodoForm dueDate={dueDate} />` 위치를 가리켰고, call stack에는 `app/todos/actions.ts`가 포함됐다.

### 원인

`frontend/app/todos/actions.ts`는 파일 상단에 `"use server"`가 있는 Server Actions 파일이다. 이 파일에서 `emptyState` 객체를 export하고 있었기 때문에 Next.js가 Server Actions 규칙 위반으로 처리했다.

`"use server"` 파일은 async function만 export해야 한다. 폼 초기 상태 같은 일반 객체는 client component 내부에 두거나 별도 일반 모듈로 분리해야 한다.

### 해결

`actions.ts`에서는 Server Action 함수만 export하도록 정리했다. `emptyState` 객체 export를 제거하고, `NewTodoForm.tsx`와 `EditTodoForm.tsx`가 각자 초기 action state를 갖도록 변경했다.

### 확인

아래 명령으로 타입 검사와 빌드를 확인한다.

```powershell
cd frontend
npm.cmd run typecheck
npm.cmd run build
```

수동 확인은 백엔드와 프론트엔드를 실행한 뒤 `/todos/new`에 접근해 Runtime Error가 사라졌는지 확인한다.

```powershell
cd backend
.\.venv\Scripts\python -m uvicorn main:app --reload --port 8000
```

```powershell
cd frontend
npm.cmd run dev
```
