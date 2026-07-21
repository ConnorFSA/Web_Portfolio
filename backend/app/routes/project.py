from flask import Blueprint, jsonify, abort
from app.db import get_db
from app.services.project import (
    get_all_projects,
    get_project_by_slug,
    get_project_brief_by_slug,
)

projects_bp = Blueprint('projects', __name__, url_prefix='/api/projects')


@projects_bp.get('')
def get_projects():
    db = get_db()
    projects = get_all_projects(db)
    return jsonify(projects)


@projects_bp.get('/<slug>')
def get_project(slug: str):
    db = get_db()
    project = get_project_by_slug(db, slug)
    if project is None:
        abort(404, description=f"No project found with slug '{slug}'")
    return jsonify(project)


@projects_bp.get('/<slug>/brief')
def get_project_brief(slug: str):
    db = get_db()
    project = get_project_brief_by_slug(db, slug)
    if project is None:
        abort(404, description=f"No project found with slug '{slug}'")
    return jsonify(project)
