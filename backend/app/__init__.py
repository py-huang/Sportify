from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from app.models import db
from app.routes import routes
from app.controllers import *

def create_app():
    app = Flask(__name__)

    # 啟用 CORS，允許所有來源
    CORS(app)

    # 載入環境變數
    load_dotenv()

    # 設定資料庫
    app.config.from_object("config.Config")

    # 初始化資料庫
    db.init_app(app)

    # 註冊路由
    app.register_blueprint(routes)

    return app