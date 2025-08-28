from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.settings import settings
from routes import product, user, store, gateway, esl, sync_log, auth, category

app = FastAPI(title="ESL Management Backend")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(product.router)
app.include_router(user.router)
app.include_router(store.router)
app.include_router(gateway.router)
app.include_router(esl.router)
app.include_router(sync_log.router)
app.include_router(category.router)

@app.get("/")
def root():
    return {"message": "ESL Management Backend is running"} 