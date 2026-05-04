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

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
    return g.db

def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()