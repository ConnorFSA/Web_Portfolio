import os
from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
 
# Load .env before anything else so os.environ is populated when
# services/auth.py reads JWT_SECRET etc. at import time.
load_dotenv()
 
from app.db import close_db
from app.routes.project import projects_bp
from app.routes.auth import auth_bp
from app.routes.admin_project import admin_project_bp
from app.routes.languages import languages_bp
from app.routes.tools import tools_bp
 
 
# Application factory keeps configuration and blueprint registration in one place,
# making the service easier to test and deploy across different environments.
def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.environ.get("JWT_SECRET", "dev-fallback-key")
 

    ENV = os.environ.get("FLASK_ENV", "development")
    # Development accepts the browser directly, while production restricts access
    # to the configured frontend origin.
    if ENV == "production":
        # Strict Production Policy
        FRONTEND_URL = os.environ.get("FRONTEND_ORIGIN")
        
        if not FRONTEND_URL:
            raise RuntimeError("PRODUCTION ERROR: FRONTEND_ORIGIN environment variable is missing!")
            
        CORS(app, resources={r"/api/*": {"origins": FRONTEND_URL}})
    else:
        # Development Policy
        CORS(app)

 
    # Each route group encapsulates a distinct API concern and is mounted here
    # to keep the application structure modular and maintainable.
    app.register_blueprint(projects_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(languages_bp)
    app.register_blueprint(tools_bp)
    app.register_blueprint(admin_project_bp)
 
    # Closing the database connection at the end of each request prevents
    # connection leakage and keeps the app stateless across requests.
    app.teardown_appcontext(close_db)
 
    return app
 
 
app = create_app()
 
if __name__ == "__main__":
    app=create_app()
    app.run(port=5000)