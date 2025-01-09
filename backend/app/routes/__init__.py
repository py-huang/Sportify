from flask import Blueprint
from ..controllers import get_events, add_event, get_signup_events, signup_event, cancel_signup_event, get_event_discussions, add_discussion

routes = Blueprint('routes', __name__)

routes.add_url_rule('/api/events', view_func=get_events, methods=['GET'])
routes.add_url_rule('/api/events', view_func=add_event, methods=['POST'])
routes.add_url_rule('/api/signup_events/<user_id>', view_func=get_signup_events, methods=['GET'])
routes.add_url_rule('/api/signup_events', view_func=signup_event, methods=['POST'])
routes.add_url_rule('/api/cancel_signup_event', view_func=cancel_signup_event, methods=['DELETE'])
routes.add_url_rule('/api/events/<int:event_id>/discussions', view_func=get_event_discussions, methods=['GET'])
routes.add_url_rule('/api/events/discussions', view_func=add_discussion, methods=['POST'])