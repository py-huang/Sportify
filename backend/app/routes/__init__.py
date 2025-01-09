from flask import Blueprint
from ..controllers import delete_event, get_events, add_event, get_signup_events, signup_event, cancel_signup_event, update_event

routes = Blueprint('routes', __name__)

routes.add_url_rule('/api/events', view_func=get_events, methods=['GET'])
routes.add_url_rule('/api/events', view_func=add_event, methods=['POST'])
routes.add_url_rule('/api/events/<event_id>', view_func=delete_event, methods=['DELETE'])  # Delete event by event_id
routes.add_url_rule('/api/events/<event_id>', view_func=update_event, methods=['PUT'])  # Update event by event_id

routes.add_url_rule('/api/signup_events/<user_id>', view_func=get_signup_events, methods=['GET'])
routes.add_url_rule('/api/signup_events', view_func=signup_event, methods=['POST'])
routes.add_url_rule('/api/cancel_signup_event', view_func=cancel_signup_event, methods=['DELETE'])