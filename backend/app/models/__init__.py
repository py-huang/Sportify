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