from flask import request, jsonify, abort
from ..models import db, EVENT_LIST, SIGNUP_RECORD, EVENT_DISCUSS, JOIN_RECORD, USER
from datetime import datetime

def get_events():
    try:
        # 取得查詢參數
        host_id = request.args.get('host_id')

        # 如果有提供 host_id，篩選該 host 的事件
        if host_id:
            events = EVENT_LIST.query.filter_by(HOST_ID=host_id).all()
            if not events:
                return jsonify({"message": f"No events found for host_id: {host_id}"}), 404
        else:
            # 否則返回所有事件
            events = EVENT_LIST.query.all()

        # 返回結果
        return jsonify([event.to_dict() for event in events]), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

def delete_event(event_id):
    try:
        # 查找要刪除的事件
        event = EVENT_LIST.query.get(event_id)
        if not event:
            return jsonify({"message": f"Event with ID {event_id} not found"}), 404
        
        # 刪除事件
        db.session.delete(event)
        db.session.commit()
        
        return jsonify({"message": f"Event with ID {event_id} deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

def update_event(event_id):
    try:
        # 查找要修改的事件
        event = EVENT_LIST.query.get(event_id)
        if not event:
            return jsonify({"message": f"Event with ID {event_id} not found"}), 404

        # 取得 JSON 資料
        data = request.json

        # 更新事件資訊
        event.EVENT_DATE = data.get('date', event.EVENT_DATE)
        event.EVENT_START_TIME = data.get('startTime', event.EVENT_START_TIME)
        event.EVENT_END_TIME = data.get('endTime', event.EVENT_END_TIME)
        event.EVENT_LOCATION = data.get('location', event.EVENT_LOCATION)
        event.EVENT_SPORT = data.get('description', event.EVENT_SPORT)
        event.HOST_ID = data.get('host', event.HOST_ID)

        # 提交更改
        db.session.commit()

        return jsonify({"message": f"Event with ID {event_id} updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


def get_signup_events(user_id):
    signups = SIGNUP_RECORD.query.filter_by(SIGN_USER=user_id).join(EVENT_LIST).all()
    return jsonify([signup.to_dict() for signup in signups])

def add_event():
    try:
        data = request.get_json()
        if not data:
            abort(400, description="Invalid JSON payload")

        date = data.get('date')
        start_time = data.get('startTime')
        end_time = data.get('endTime')
        description = data.get('description')
        location = data.get('location')
        host = data.get('host')

        if not all([date, start_time, end_time, description, location, host]):
            abort(400, description="Missing required fields")

        event_date = datetime.strptime(date, '%Y-%m-%d').date()
        event_start_time = datetime.strptime(start_time, '%H:%M:%S').time()
        event_end_time = datetime.strptime(end_time, '%H:%M:%S').time()

        new_event = EVENT_LIST(
            EVENT_DATE=event_date,
            EVENT_START_TIME=event_start_time,
            EVENT_END_TIME=event_end_time,
            EVENT_SPORT=description,
            EVENT_LOCATION=location,
            HOST_ID=host
        )

        db.session.add(new_event)
        db.session.commit()

        return jsonify(new_event.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

def signup_event():
    try:
        data = request.get_json()
        if not data:
            abort(400, description="Invalid JSON payload")

        user_id = data.get('userId')
        event_id = data.get('eventId')

        if not all([user_id, event_id]):
            abort(400, description="Missing required fields")

        event = EVENT_LIST.query.get(event_id)
        if not event:
            abort(404, description="Event not found")

        existing_signup = SIGNUP_RECORD.query.filter_by(SIGN_USER=user_id, SIGN_EVENT=event_id).first()
        if existing_signup:
            return jsonify({"message": "User has already signed up for this event."}), 400

        signup = SIGNUP_RECORD(SIGN_USER=user_id, SIGN_EVENT=event_id)
        db.session.add(signup)
        db.session.commit()

        return jsonify(signup.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

def cancel_signup_event():
    try:
        data = request.get_json()
        if not data:
            abort(400, description="Invalid JSON payload")

        user_id = data.get('userId')
        event_id = data.get('eventId')

        if not all([user_id, event_id]):
            abort(400, description="Missing required fields")

        signup = SIGNUP_RECORD.query.filter_by(SIGN_USER=user_id, SIGN_EVENT=event_id).first()
        if not signup:
            return jsonify({"message": "Signup record not found."}), 404

        db.session.delete(signup)
        db.session.commit()

        return jsonify({"message": "Signup successfully canceled."}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

def get_event_discussions(event_id):
    try:
        discussions = EVENT_DISCUSS.query.filter_by(COMMENT_EVENT_ID=event_id).all()

        if not discussions:
            return jsonify([]), 200

        return jsonify([discussion.to_dict() for discussion in discussions]), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

def add_discussion():
    try:
        data = request.get_json()
        if not data:
            abort(400, description="Invalid JSON payload")

        user_id = data.get('user_id')
        event_id = data.get('event_id')
        comment = data.get('comment')

        if not all([user_id, event_id, comment]):
            abort(400, description="Missing required fields")

        new_comment = EVENT_DISCUSS(
            COMMENT_USER_ID=user_id,
            COMMENT_EVENT_ID=event_id,
            COMMENT=comment,
            COMMENT_TIME=datetime.now()
        )

        db.session.add(new_comment)
        db.session.commit()

        return jsonify(new_comment.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

def add_join_record():
    try:
        data = request.get_json()
        if not data:
            abort(400, description="Invalid JSON payload")

        user_id = data.get('user_id')
        event_id = data.get('event_id')

        if not all([user_id, event_id]):
            abort(400, description="Missing required fields")

        # 自動生成 join_time 和 leave_time
        join_time = datetime.now()
        leave_time = datetime.now() # 初始設定為 None，稍後可更新

        # 自動生成 is_absence
        is_absence = 1  # 預設為 0，表示出席

        # 檢查記錄是否已存在
        existing_record = JOIN_RECORD.query.filter_by(JOIN_USER_ID=user_id, JOIN_EVENT_ID=event_id).first()
        if existing_record:
            return jsonify({"message": "Join record already exists for this user and event."}), 400

        # 新增記錄
        new_record = JOIN_RECORD(
            JOIN_USER_ID=user_id,
            JOIN_EVENT_ID=event_id,
            JOIN_TIME=join_time,
            LEAVE_TIME=leave_time,
            IS_ABSENCE=is_absence
        )

        db.session.add(new_record)
        db.session.commit()

        return jsonify(new_record.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

def get_user_joined_events(user_id):
    try:
        # 查詢 JOIN_RECORD 表格，並與 EVENT_LIST 進行連接，取得該使用者的所有參加活動紀錄
        joined_events = JOIN_RECORD.query.join(EVENT_LIST, JOIN_RECORD.JOIN_EVENT_ID == EVENT_LIST.EVENT_ID).filter(JOIN_RECORD.JOIN_USER_ID == user_id).all()

        # 如果沒有該使用者的活動紀錄，回傳空列表
        if not joined_events:
            return jsonify({"message": f"No joined events found for user_id: {user_id}"}), 404

        # 返回結果，並將 JOIN_RECORD 和 EVENT_LIST 資料一起返回
        return jsonify([record.to_dict() for record in joined_events]), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

def get_user_info(user_id):
    try:
        # 查詢指定 user_id 的使用者資訊
        user = USER.query.filter_by(USERID=user_id).first()

        # 如果使用者不存在，返回 404
        if not user:
            return jsonify({"message": f"User with ID {user_id} not found"}), 404

        # 返回使用者資訊，假設 USER_LIST 有 to_dict 方法來轉換為字典
        return jsonify(user.to_dict()), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
