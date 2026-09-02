import sqlite3
import os
from flask import g

# get the absolute path of this file then go up three levels to get the base directory of the project
BASE_DIR = os.path.dirname(  # /home/ubuntu/Web_Portfolio
    os.path.dirname(          # /home/ubuntu/Web_Portfolio/backend
        os.path.dirname(      # /home/ubuntu/Web_Portfolio/backend/app
            os.path.abspath(__file__)  # /home/ubuntu/Web_Portfolio/backend/app/db.py
        )
    )
)

DATABASE = os.path.join(BASE_DIR, 'db', 'projects.db')

# A request-scoped database connection keeps the application simple while ensuring
# each request gets a consistent connection and avoids global state.
def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE)
        # sqlite3.Row allows us to access the columns of the result set by name instead of index
        g.db.row_factory = sqlite3.Row
    return g.db

# Database resources are closed at the end of the request lifecycle to prevent
# long lived connections and reduce the risk of stale state during development.
def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()