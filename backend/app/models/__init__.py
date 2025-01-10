from flask_sqlalchemy import SQLAlchemy

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
            "location": self.EVENT_LOCATION,
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
            "event": self.event.to_dict(),
        }
        
class EVENT_DISCUSS(db.Model):
    __tablename__ = 'event_discuss'

    COMMENT_ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    COMMENT_USER_ID = db.Column(db.String(12), nullable=False)
    COMMENT_EVENT_ID = db.Column(db.Integer, db.ForeignKey('event_list.EVENT_ID'), nullable=False)
    COMMENT = db.Column(db.String(100), nullable=False)
    COMMENT_TIME = db.Column(db.TIMESTAMP, nullable=False, default=db.func.current_timestamp())

    event = db.relationship('EVENT_LIST', backref='comments')

    def to_dict(self):
        return {
            "comment_id": self.COMMENT_ID,
            "user_id": self.COMMENT_USER_ID,
            "event_id": self.COMMENT_EVENT_ID,
            "comment": self.COMMENT,
            "comment_time": self.COMMENT_TIME.strftime('%Y-%m-%d %H:%M:%S'),
        }

class JOIN_RECORD(db.Model):
    __tablename__ = 'join_record'

    JOIN_USER_ID = db.Column(db.String(12), db.ForeignKey('users.USERID'), primary_key=True, nullable=False)
    JOIN_EVENT_ID = db.Column(db.Integer, db.ForeignKey('event_list.EVENT_ID'), primary_key=True, nullable=False)
    JOIN_TIME = db.Column(db.Time, nullable=True, default=None)
    LEAVE_TIME = db.Column(db.Time, nullable=True, default=None)
    IS_ABSENCE = db.Column(db.Boolean, nullable=False, default=0)

    event = db.relationship('EVENT_LIST', backref='join_records')

 
    def to_dict(self):
        # 返回與活動有關的所有欄位資料
        event_dict = {
            "id": self.event.EVENT_ID,
            "host": self.event.HOST_ID,
            "date": self.event.EVENT_DATE.strftime('%Y-%m-%d') if self.event.EVENT_DATE else None,
            "startTime": self.event.EVENT_START_TIME.strftime('%H:%M:%S') if self.event.EVENT_START_TIME else None,
            "endTime": self.event.EVENT_END_TIME.strftime('%H:%M:%S') if self.event.EVENT_END_TIME else None,
            "description": self.event.EVENT_SPORT,
            "location": self.event.EVENT_LOCATION
        }

        # 返回 JOIN_RECORD 資料，並嵌套 event 資料
        return {
            "join_user_id": self.JOIN_USER_ID,
            "join_event_id": self.JOIN_EVENT_ID,
            "join_time": self.JOIN_TIME.strftime('%H:%M:%S') if self.JOIN_TIME else None,
            "leave_time": self.LEAVE_TIME.strftime('%H:%M:%S') if self.LEAVE_TIME else None,
            "is_absence": self.IS_ABSENCE,
            "event": event_dict  # 在這裡返回 event 的所有資訊
        }

class USER(db.Model):
    __tablename__ = 'users'

    USERID = db.Column(db.String(12), primary_key=True)
    NAME = db.Column(db.String(10), nullable=False)
    SEX = db.Column(db.String(2), nullable=False)
    AGE = db.Column(db.Integer, nullable=False)
    IS_NCCU = db.Column(db.Boolean, nullable=False)
    INTRODUCE = db.Column(db.String(100), nullable=True)

    def to_dict(self):
        return {
            "user_id": self.USERID,
            "name": self.NAME,
            "sex": self.SEX,
            "age": self.AGE,
            "is_nccu": self.IS_NCCU,
            "introduce": self.INTRODUCE,
        }
