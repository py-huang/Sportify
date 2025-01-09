from flask import Flask
from flask_cors import CORS
from models import db
from routes import routes
from dotenv import load_dotenv
import os

def create_app():
    app = Flask(__name__)
    CORS(app)

    load_dotenv()
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    app.register_blueprint(routes)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=8000)