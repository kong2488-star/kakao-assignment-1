# 공통 Button 컴포넌트 분리 계획

## Summary

- 버튼들을 `src/components/ui/Button.jsx`로 모아 공통 컴포넌트화한다.
- `TodoForm`의 추가 버튼과 `TodoItem`의 저장/취소/수정/완료/삭제 버튼을 모두 `Button` 컴포넌트로 교체한다.
- Todo 동작은 유지하고 Tailwind 클래스 중복만 줄인다.

## Implementation Changes

- `src/components/ui/Button.jsx`를 생성한다.
- `variant`는 `primary`, `secondary`, `muted`, `soft`, `danger`로 구성한다.
- `size`는 `md`, `lg`로 구성한다.
- 기본 `type`은 `"button"`으로 둔다.
- 폼 제출 버튼만 `type="submit"`을 명시한다.
- `TodoForm.jsx`, `TodoItem.jsx`의 기존 `<button>`을 `<Button>`으로 교체한다.
- 추가 의존성 없이 배열과 `filter(Boolean).join(" ")` 방식으로 `className`을 조합한다.

## Test Plan

- `npm.cmd run build`로 Vite 빌드 성공 여부를 확인한다.
- Todo 추가 버튼 클릭과 Enter submit 동작을 확인한다.
- 인라인 수정의 저장/취소 동작을 확인한다.
- 완료/취소 토글과 삭제 동작을 확인한다.

## Assumptions

- 버튼 위치는 `src/components/ui/Button.jsx`로 둔다.
- 다른 UI 컴포넌트는 이번 단계에서 분리하지 않는다.
- 기존 Todo 컴포넌트 파일 위치는 유지한다.
