import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.db import Base, SessionLocal, engine
from app.routers import activity, auth, health, home, learning, life, life_services, users, voice
from app.seed import init_seed_data

app = FastAPI(title=settings.app_name)

app.add_middleware(
  CORSMiddleware,
  allow_origins=['*'],
  allow_credentials=True,
  allow_methods=['*'],
  allow_headers=['*']
)


os.makedirs(settings.static_dir, exist_ok=True)
app.mount('/static', StaticFiles(directory=settings.static_dir), name='static')


@app.on_event('startup')
def on_startup():
  Base.metadata.create_all(bind=engine)
  db = SessionLocal()
  try:
    init_seed_data(db)
  finally:
    db.close()


app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(users.router, prefix=settings.api_prefix)
app.include_router(home.router, prefix=settings.api_prefix)
app.include_router(health.router, prefix=settings.api_prefix)
app.include_router(learning.router, prefix=settings.api_prefix)
app.include_router(activity.router, prefix=settings.api_prefix)
app.include_router(life.router, prefix=settings.api_prefix)
app.include_router(life_services.router, prefix=settings.api_prefix)
app.include_router(voice.router, prefix=settings.api_prefix)


@app.get('/')
def root():
  return {
    'message': '银龄通后端服务运行中'
  }
