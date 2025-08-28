from fastapi import FastAPI  # To define fast api app
from app.routes import auth

app = FastAPI()


app.include_router(auth.router, prefix="/auth", tags=["Auth"])
