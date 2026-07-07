# Git 작업 및 커밋 규칙

## 저장소와 브랜치

- `kakao-assignment-3`은 기존 원격 저장소의 별도 worktree로 사용한다.
- 작업 브랜치는 `origin/main`에서 분기한 `week03-eojin`이다.
- `main`에서 checkout, commit, reset, merge 또는 push하지 않는다.
- 기존 `week02-서어진` worktree와 그 수정 파일을 변경하거나 stage하지 않는다.
- 현재 브랜치가 `week03-eojin`이 아니면 파일 변경과 커밋을 중단한다.

## 커밋 단위

- 승인된 Plan 하나당 로컬 커밋 하나를 기본값으로 한다.
- 구현, 테스트, 관련 문서, `Completed` Plan과 하네스 로그를 같은 커밋에 포함한다.
- 커밋 메시지는 Conventional Commits 형식을 사용한다.

```text
<type>: <short english summary>
```

- 허용 type: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`
- 제목은 명령형의 간결한 영문으로 작성한다.

## Staging

- 하네스 로그에 기록된 해당 Plan의 변경 파일만 개별적으로 stage한다.
- `git add .`, `git add -A`, `git commit -a`를 사용하지 않는다.
- 범위 밖 변경이나 사용자가 만든 기존 변경은 stage하지 않는다.
- stage 후 [커밋 전 검증](PRE_COMMIT_VALIDATION.md)의 `Staged` 단계를 통과해야 한다.

## 승인 기반 커밋

커밋 직전에 사용자에게 다음 내용을 제시한다.

- 현재 브랜치
- staged 파일 목록
- staged diff 요약
- 실행한 필수 검증과 결과
- 제안 커밋 메시지

사용자가 명시적으로 승인한 뒤에만 `git commit`을 실행한다. Plan 구현 승인은 커밋 승인으로 간주하지 않는다.

승인 후 staged 내용이 변경되면 승인은 무효다. 검증과 staged 감사를 다시 수행하고 새 승인을 받아야 한다.

## 커밋 차단 조건

다음 중 하나라도 해당하면 커밋하지 않는다.

- 현재 브랜치가 `week03-eojin`이 아님
- Git 작성자 이름 또는 이메일이 없음
- Plan 또는 하네스 로그가 완료되지 않음
- 필수 검증 실패 또는 미실행
- staged 파일이 Plan 범위를 벗어남
- 금지 파일이나 민감정보가 의심됨
- staged diff에 충돌 표식이나 whitespace 오류가 있음

예외 승인으로 우회하지 않는다. 원인을 해결하고 검증을 다시 수행한다.

## 커밋 이후

- 커밋 해시를 하네스 로그에 기록하는 후속 문서 커밋은 만들지 않는다.
- push, merge, branch 삭제, Pull Request 생성은 별도의 명시적 요청이 있을 때만 수행한다.
- 커밋이 실패하면 Plan과 로그를 `In Progress`로 유지하고 실패 원인을 로그에 기록한다.
