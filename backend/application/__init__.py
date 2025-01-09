from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import os

db = SQLAlchemy()

class EVENT_LIST(db.Model):
    __tablename__ = 'event_list'
    
    EVENT_ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    EVENT_DATE = db.Column(db.Date, nullable=False)
    EVENT_START_TIME = db.Column(db.Time, nullable=False)
    EVENT_END_TIME = db.Column(db.Time, nullable=False)
    EVENT_SPORT = db.Column(db.String(8), nullable=False)
    EVENT_LOCATION = db.Column(db.String(10), nullable=False)
    HOST_ID = db.Column(db.String(12), nullable=False)

    def to_dict(self):
        return {
            "id": self.EVENT_ID,
            "host": self.HOST_ID,
            "date": self.EVENT_DATE.strftime('%Y-%m-%d'),
            "startTime": self.EVENT_START_TIME.strftime('%H:%M:%S') if self.EVENT_START_TIME else None,
            "endTime": self.EVENT_END_TIME.strftime('%H:%M:%S') if self.EVENT_END_TIME else None,
            "description": self.EVENT_SPORT,
            "location": self.EVENT_LOCATION
        }

class SIGNUP_RECORD(db.Model):
    __tablename__ = 'signup_record'
    
    SIGN_ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    SIGN_USER = db.Column(db.String(12), nullable=False)
    SIGN_EVENT = db.Column(db.Integer, db.ForeignKey('event_list.EVENT_ID'), nullable=False)
    SIGN_TIME = db.Column(db.TIMESTAMP, nullable=False, default=db.func.current_timestamp())

    event = db.relationship('EVENT_LIST', backref='signups')

    def to_dict(self):
        return {
            "sign_id": self.SIGN_ID,
            "sign_user": self.SIGN_USER,
            "sign_time": self.SIGN_TIME.strftime('%Y-%m-%d %H:%M:%S'),
            "event": self.event.to_dict()
        }

def create_app():
    app = Flask(__name__)

 # 啟用 CORS，允許所有來源
    CORS(app)

    # 載入環境變數
    load_dotenv()

    # 設定資料庫
    app.config.from_object("application.config.Config")

    # 初始化資料庫
    db.init_app(app)

    # 註冊路由
    # API 路由：從 MySQL 資料庫查詢事件資料
    @app.route('/api/events', methods=['GET'])
    def get_events():
        # 使用 SQLAlchemy 查詢資料
        events = EVENT_LIST.query.all()
        
        # 將資料轉換成 JSON 格式
        return jsonify([event.to_dict() for event in events])
    
    @app.route('/api/signup_events/<user_id>', methods=['GET'])
    def get_signup_events(user_id):
        # 使用 SQLAlchemy 查詢特定使用者的報名紀錄，並且 JOIN 活動資料
        signups = SIGNUP_RECORD.query.filter_by(SIGN_USER=user_id).join(EVENT_LIST).all()

        # 將資料轉換成 JSON 格式並回傳
        return jsonify([signup.to_dict() for signup in signups])


    return app
