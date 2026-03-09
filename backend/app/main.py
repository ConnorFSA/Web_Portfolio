from flask import Flask
import sqlite3

app = Flask(__name__)

def get_db_connection():
    db = sqlite3.connect("../db/projects.db")
    # queries return a row objects instead of a tuple
    # allows accessing columns by name instead of index
    db.row_factory = sqlite3.Row
    return db


# TODO: parameterized queries for better search
@app.get("/api/projects")
def get_projects(count: int = 10):
    # db = get_db_connection()
    # projects = db.execute()

    #test data
    return([
        {
            "id": 1,
            "thumbnail": "https://via.placeholder.com/300x200?text=Project+1",
            "name": "Portfolio Website",
            "type": "Web Application",
            "summary": "A responsive portfolio website built with React and TypeScript, showcasing projects and skills.",
            "categories": ["Web Development", "Frontend"],
            "languages": ["TypeScript", "React", "CSS"],
            "date": "2023-10-15T00:00:00Z"
        },
        {
            "id": 2,
            "thumbnail": "https://via.placeholder.com/300x200?text=Project+2",
            "name": "Task Manager API",
            "type": "Backend Service",
            "summary": "A RESTful API for managing tasks, built with Flask and SQLite, including authentication and CRUD operations.",
            "categories": ["Backend", "API"],
            "languages": ["Python", "Flask", "SQL"],
            "date": "2023-11-20T00:00:00Z"
        }
    ])