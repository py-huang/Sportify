from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import os
from datetime import datetime

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
    @app.route('/api/events', methods=['GET'])
    def get_events():
        events = EVENT_LIST.query.all()
        return jsonify([event.to_dict() for event in events])
    
    @app.route('/api/signup_events/<user_id>', methods=['GET'])
    def get_signup_events(user_id):
        signups = SIGNUP_RECORD.query.filter_by(SIGN_USER=user_id).join(EVENT_LIST).all()
        return jsonify([signup.to_dict() for signup in signups])

    # API 路由：新增活動
    @app.route('/api/events', methods=['POST'])
    def add_event():
        try:
            data = request.get_json()
            if not data:
                abort(400, description="Invalid JSON payload")

            # 提取並驗證字段
            date = data.get('date')
            start_time = data.get('startTime')
            end_time = data.get('endTime')
            description = data.get('description')
            location = data.get('location')
            host = data.get('host')

            if not all([date, start_time, end_time, description, location, host]):
                abort(400, description="Missing required fields")

            # 轉換字串為日期/時間格式
            event_date = datetime.strptime(date, '%Y-%m-%d').date()
            event_start_time = datetime.strptime(start_time, '%H:%M:%S').time()
            event_end_time = datetime.strptime(end_time, '%H:%M:%S').time()

            # 創建新活動實例
            new_event = EVENT_LIST(
                EVENT_DATE=event_date,
                EVENT_START_TIME=event_start_time,
                EVENT_END_TIME=event_end_time,
                EVENT_SPORT=description,
                EVENT_LOCATION=location,
                HOST_ID=host
            )

            # 新增活動到資料庫
            db.session.add(new_event)
            db.session.commit()

            return jsonify(new_event.to_dict()), 201  # 返回創建的活動

        except Exception as e:
            db.session.rollback()
            print(f"Error: {e}")
            return jsonify({"error": str(e)}), 500
    
     # API 路由：報名活動
    @app.route('/api/signup_events', methods=['POST'])
    def signup_event():
        try:
            data = request.get_json()
            if not data:
                abort(400, description="Invalid JSON payload")

            # 提取並驗證字段
            user_id = data.get('userId')
            event_id = data.get('eventId')

            if not all([user_id, event_id]):
                abort(400, description="Missing required fields")

            # 檢查活動是否存在
            event = EVENT_LIST.query.get(event_id)
            if not event:
                abort(404, description="Event not found")

            # 檢查用戶是否已報名該活動
            existing_signup = SIGNUP_RECORD.query.filter_by(SIGN_USER=user_id, SIGN_EVENT=event_id).first()
            if existing_signup:
                return jsonify({"message": "User has already signed up for this event."}), 400

            # 創建報名記錄
            signup = SIGNUP_RECORD(SIGN_USER=user_id, SIGN_EVENT=event_id)

            # 儲存報名到資料庫
            db.session.add(signup)
            db.session.commit()

            # 返回創建的報名記錄
            return jsonify(signup.to_dict()), 201

        except Exception as e:
            db.session.rollback()
            print(f"Error: {e}")
            return jsonify({"error": str(e)}), 500

    @app.route('/api/cancel_signup_event', methods=['DELETE'])
    def cancel_signup_event():
        try:
            data = request.get_json()
            if not data:
                abort(400, description="Invalid JSON payload")

            # Extract and validate fields
            user_id = data.get('userId')
            event_id = data.get('eventId')

            if not all([user_id, event_id]):
                abort(400, description="Missing required fields")

            # Check if the signup exists
            signup = SIGNUP_RECORD.query.filter_by(SIGN_USER=user_id, SIGN_EVENT=event_id).first()
            if not signup:
                return jsonify({"message": "Signup record not found."}), 404

            # Delete the signup record
            db.session.delete(signup)
            db.session.commit()

            # Return a success message
            return jsonify({"message": "Signup successfully canceled."}), 200

        except Exception as e:
            db.session.rollback()
            print(f"Error: {e}")
            return jsonify({"error": str(e)}), 500

    return app
