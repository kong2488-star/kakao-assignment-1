# 커밋 전 검증 게이트

## 목적

커밋에는 승인된 Plan 범위의 변경과 검증 가능한 결과만 포함한다. 검증은 stage 전 코드 품질 확인과 stage 후 커밋 내용 감사의 두 단계로 수행한다.

## 공통 진입점

저장소 루트에서 다음 명령을 사용한다.

```powershell
./scripts/verify-before-commit.ps1 -Phase PreStage
./scripts/verify-before-commit.ps1 -Phase Staged
```

모든 필수 검증이 통과하면 종료 코드 `0`, 하나라도 실패하면 비정상 종료 코드를 반환한다.

## 1단계: PreStage

변경 및 미추적 파일을 분석해 영향 영역을 결정한다.

- Frontend 변경: `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm run build`
- Backend 변경: `ruff check .`, `pytest`
- API 또는 공통 계약 변경: Frontend와 Backend 검증 모두
- Markdown 전용 변경: 로컬 Markdown 링크, 필수 문서 구조와 충돌 표식 검사

아직 해당 애플리케이션 디렉터리나 명령이 구성되지 않았다면 그 영역의 코드 변경을 검증 완료로 보지 않는다.

검증 후 코드, 설정 또는 테스트 파일이 변경되면 영향 영역의 `PreStage` 검증을 다시 실행한다.

## 완료 문서 갱신

`PreStage` 통과 후 하네스 로그에 실제 결과를 기록하고 Plan과 로그의 완료 항목을 확정한다. 이 과정에서 변경되는 Markdown은 코드 검증 결과를 무효화하지 않지만 `Staged` 문서 검증 대상에 포함한다.

## 2단계: Staged

이번 Plan 파일만 개별 stage한 뒤 다음을 검사한다.

- 현재 브랜치가 `week03-eojin`인지
- staged 파일이 존재하는지
- `git diff --cached --check` 통과 여부
- staged 파일의 Markdown 링크와 필수 구조
- Plan과 하네스 로그의 동일 번호·제목 및 완료 상태
- `.env`, DB, 키 파일, 빌드 결과물 등 금지 파일
- staged 추가 라인의 키, 토큰, 비밀번호, 개인 키 등 민감정보 패턴
- 병합 충돌 표식

민감정보 검사 실패 시 실제 비밀값을 출력하지 않고 의심 파일과 규칙만 보고한다.

## 커밋 승인

`Staged` 통과 후 staged 파일, diff 요약, 검증 결과와 제안 메시지를 사용자에게 제시한다. 사용자의 명시적 승인 후 staged tree가 바뀌지 않았음을 확인하고 커밋한다.

검증 이후 staged 파일이 변경되거나 추가되면 `Staged` 검증과 사용자 승인을 다시 받는다. 코드·설정·테스트까지 변경됐다면 `PreStage`부터 다시 시작한다.

## 실패 정책

- 필수 검증 실패나 미실행 상태에서는 커밋하지 않는다.
- 환경 제약도 예외로 우회하지 않는다.
- 실패 원인과 해결 과정을 하네스 로그에 기록한다.
- 문제를 해결한 뒤 해당 단계부터 다시 검증한다.
