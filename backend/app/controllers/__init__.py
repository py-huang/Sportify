from flask import request, jsonify, abort
from ..models import db, EVENT_LIST, SIGNUP_RECORD, EVENT_DISCUSS
from datetime import datetime

def get_events():
    events = EVENT_LIST.query.all()
    return jsonify([event.to_dict() for event in events])

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