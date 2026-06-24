from fastapi import FastAPI

app = FastAPI(title="Kakao Todo API")


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
