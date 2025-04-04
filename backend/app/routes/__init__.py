from flask import Blueprint
from ..controllers import delete_event, get_events, add_event, get_signup_events, signup_event, cancel_signup_event, update_event, get_event_discussions, add_discussion, add_join_record, get_user_joined_events, get_user_info

routes = Blueprint('routes', __name__)

routes.add_url_rule('/api/events', view_func=get_events, methods=['GET'])
routes.add_url_rule('/api/events', view_func=add_event, methods=['POST'])
routes.add_url_rule('/api/events/<event_id>', view_func=delete_event, methods=['DELETE'])  # Delete event by event_id
routes.add_url_rule('/api/events/<event_id>', view_func=update_event, methods=['PUT'])  # Update event by event_id

routes.add_url_rule('/api/signup_events/<user_id>', view_func=get_signup_events, methods=['GET'])
routes.add_url_rule('/api/signup_events', view_func=signup_event, methods=['POST'])
routes.add_url_rule('/api/cancel_signup_event', view_func=cancel_signup_event, methods=['DELETE'])
routes.add_url_rule('/api/events/<int:event_id>/discussions', view_func=get_event_discussions, methods=['GET'])
routes.add_url_rule('/api/events/discussions', view_func=add_discussion, methods=['POST'])

routes.add_url_rule('/api/join_records', view_func=add_join_record, methods=['POST'])
routes.add_url_rule('/api/join_events/<user_id>', view_func=get_user_joined_events, methods=['GET'])

routes.add_url_rule('/api/users/<user_id>', view_func=get_user_info, methods=['GET'])

