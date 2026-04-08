# backend/app/main.py
import time
import threading
import asyncio
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .auth import router as auth_router, get_current_user
from .chat import router as chat_router
from .database import engine, get_db
from . import models

app = FastAPI(title="WhatTheDogDoing API")

# 【核心修复 1】添加全局标志，标记数据库是否准备就绪
DB_READY = False

@app.on_event("startup")
def startup_db_client():
    def init_db():
        global DB_READY
        retries = 30  
        while retries > 0:
            try:
                models.Base.metadata.create_all(bind=engine)
                print("Successfully connected to the database and created tables.")
                DB_READY = True  # 数据库准备完毕，修改标志！
                break
            except Exception as e:
                print(f"Database not ready yet, retrying... ({retries} attempts left). Error: {e}")
                retries -= 1
                time.sleep(3)
        if retries == 0:
            print("WARNING: Failed to connect to the database after multiple attempts.")
            
    threading.Thread(target=init_db, daemon=True).start()

# 【核心修复 2】添加异步等待中间件
@app.middleware("http")
async def wait_for_db_middleware(request: Request, call_next):
    global DB_READY
    # 放行健康检查和根路径，确保云平台探针能瞬间得到 200 响应
    if request.url.path not in ["/", "/health"] and not DB_READY:
        retries = 20
        # 异步挂起当前请求。前端会处于 loading 状态，不会报 500
        while not DB_READY and retries > 0:
            await asyncio.sleep(2)
            retries -= 1
        # 如果等了 40 秒数据库还是没连上，返回 503 提示
        if not DB_READY:
            return JSONResponse(
                status_code=503, 
                content={"detail": "Database is initializing, please try again in a moment."}
            )
    
    return await call_next(request)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://frontend-dyno-whatthedogdoing.app.spring26b.secoder.net",
        "https://frontend-dyno-WhatTheDogDoing.app.spring26b.secoder.net",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

@app.get("/")
def read_root():
    return {"Hello": "WhatTheDogDoing"}

@app.get("/health")
def health():
    return {"status": "ok"}

class DeleteAccountRequest(BaseModel):
    password: str

@app.delete("/api/users/me")
def delete_account(payload: DeleteAccountRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    from .auth import verify_password
    if not verify_password(payload.password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="密码错误")
    db.delete(current_user)
    db.commit()
    return {"message": "Account deleted successfully"}

app.include_router(auth_router)
app.include_router(chat_router, prefix="/api/chat", tags=["chat"])