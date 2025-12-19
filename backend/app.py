from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


# 1. Define the "origins" that are allowed to talk to your backend
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


# 2. Add the CORS middleware to your application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           # Allows your Vite dev server
    allow_credentials=True,
    allow_methods=["*"],              # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],              # Allows all headers
)


@app.get("/")
async def root():
    return {"status": "connected", "message": "Hello from the backend!"}