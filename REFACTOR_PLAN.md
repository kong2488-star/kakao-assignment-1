# Todo 필터 탭 기능 추가 계획

## Summary

- Todo 목록 위에 `전체`, `진행중`, `완료` 3개 필터 탭을 추가한다.
- 선택한 탭에 따라 보여줄 Todo만 필터링한다.
- 현재 선택된 탭은 배경색, 텍스트색, 그림자 등으로 명확히 구분한다.

## Implementation Changes

- `App.jsx`에 `filter` 상태를 추가하고 기본값은 `"all"`로 둔다.
- 필터 값은 `"all"`, `"active"`, `"completed"` 3개로 고정한다.
- `App.jsx`에서 `filteredTodos`를 계산해 `TodoList`에는 필터링된 목록만 전달한다.
- `src/components/TodoFilter.jsx`를 새로 만들고 `currentFilter`, `onChangeFilter` props를 받게 한다.
- `TodoFilter`는 3개 탭 버튼을 렌더링하고, 현재 선택된 탭에만 활성 스타일을 적용한다.
- `TodoList.jsx`는 현재 필터에 맞는 빈 상태 문구를 표시할 수 있게 한다.
- 기존 Todo 추가, 수정, 완료, 삭제 동작은 유지한다.

## Empty States

- 전체: `아직 등록된 할 일이 없습니다.`
- 진행중: `진행중인 할 일이 없습니다.`
- 완료: `완료된 할 일이 없습니다.`

## Test Plan

- 전체 탭에서 모든 Todo가 보이는지 확인한다.
- 진행중 탭에서 완료되지 않은 Todo만 보이는지 확인한다.
- 완료 탭에서 완료된 Todo만 보이는지 확인한다.
- 탭을 바꿀 때 활성 탭 스타일이 명확히 바뀌는지 확인한다.
- 진행중 탭에서 Todo를 완료 처리하면 목록에서 사라지는지 확인한다.
- 완료 탭에서 완료 취소하면 목록에서 사라지는지 확인한다.

## Assumptions

- 필터 상태는 URL이나 localStorage에 저장하지 않고 React state로만 관리한다.
- 필터 탭에는 개수 배지를 표시하지 않는다.
- 이번 변경은 필터 기능만 추가하고, 버튼은 각 컴포넌트에서 직접 렌더링한다.
