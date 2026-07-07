# 운영 배포

## 구성

```text
Browser
  → Vercel: Next.js
  → Render Web Service: FastAPI
  → Render PostgreSQL
```

- 운영 브랜치는 `main`이다.
- 구현과 커밋은 `week03-eojin`에서 완료하고 Pull Request로 `main`에 병합한다.
- Render Web Service와 PostgreSQL은 `singapore` 리전에 배치한다.
- Render 무료 PostgreSQL은 30일 후 만료되므로 과제 시연용으로만 사용한다.

## 1. GitHub 반영

1. `week03-eojin`의 필수 검증을 통과한다.
2. 승인된 변경만 커밋하고 원격 브랜치에 push한다.
3. `week03-eojin`에서 `main`으로 Pull Request를 만들고 병합한다.
4. Render와 Vercel은 모두 `main`을 Production Branch로 사용한다.

## 2. Render

1. GitHub 계정으로 Render에 가입하고 이 저장소 접근을 허용한다.
2. Dashboard에서 **New → Blueprint**를 선택한다.
3. `kong2488-star/kakao-assignment-1` 저장소를 연결한다.
4. Blueprint 파일 경로로 루트의 `render.yaml`을 선택한다.
5. 무료 Web Service와 무료 PostgreSQL 생성을 확인하고 Apply한다.
6. 배포 완료 후 다음 주소가 `{"status":"ok"}`를 반환하는지 확인한다.

```text
https://kakao-assignment-3-api.onrender.com/health
```

서비스 이름이 이미 사용 중이면 Render가 허용하는 고유 이름으로 변경하고 실제 URL을 Vercel 환경변수에 사용한다. `DATABASE_URL`은 Blueprint가 내부 PostgreSQL URL로 자동 설정하므로 직접 복사하거나 공개하지 않는다.

## 3. Vercel

1. GitHub 계정으로 Vercel에 가입하고 이 저장소 접근을 허용한다.
2. **Add New → Project**에서 저장소를 Import한다.
3. Root Directory를 `frontend`로 지정한다.
4. Framework Preset이 Next.js인지 확인한다.
5. Settings → Environments → Production → Branch Tracking에서 `main`을 선택한다.
6. Production 환경변수를 추가한다.

```dotenv
BACKEND_API_URL=https://실제-Render-서비스명.onrender.com
```

7. Production 배포를 실행한다.

## 4. 배포 확인

- Render `/health`가 HTTP 200과 `{"status":"ok"}`를 반환한다.
- Vercel 기본 도메인에서 Todo 목록이 열린다.
- Todo 생성, 조회, 제목 수정, 완료 전환과 삭제가 정상 동작한다.
- 프런트엔드 오류가 있으면 Vercel Runtime Logs와 Render Logs를 함께 확인한다.
- 무료 Render Web Service가 절전 상태였다면 첫 요청이 느릴 수 있으므로 잠시 후 다시 확인한다.

## 비밀정보

- 실제 DB URL, 비밀번호와 플랫폼 토큰을 저장소에 커밋하지 않는다.
- 문제 해결을 요청할 때도 DB URL 전체를 공유하지 않는다.
- 공개적으로 공유해도 되는 값은 Render 백엔드 기본 도메인과 Vercel 프런트엔드 기본 도메인뿐이다.
