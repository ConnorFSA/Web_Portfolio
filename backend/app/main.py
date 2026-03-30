from flask import Flask
from flask_cors import CORS
from db import close_db
from projects import projects_bp

app = Flask(__name__)
CORS(app)
# Register the projects blueprint
app.register_blueprint(projects_bp)

# Close the database connection when the app context ends
app.teardown_appcontext(close_db)

if __name__ == '__main__':
    app.run(debug=True)