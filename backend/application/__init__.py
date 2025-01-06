from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # 載入環境變數
    load_dotenv()

    # 設定資料庫
    app.config.from_object("application.config.Config")

    # 初始化資料庫
    db.init_app(app)

    # 註冊路由

    return app