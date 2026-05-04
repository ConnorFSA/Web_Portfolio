from flask import Blueprint, jsonify, abort
from app.db import get_db

projects_bp = Blueprint('projects', __name__, url_prefix='/api/projects')

# Helper functions for common data

# returns a lsit of languages used in a specific project and their icons
def get_languages_for_project(db, project_id: int) -> list:
    rows = db.execute("""
        SELECT l.pk_language, l.language, l.image_icon
        FROM languages l
        JOIN project_languages pl ON l.pk_language = pl.fk_language
        WHERE pl.fk_project = ?
    """, (project_id,)).fetchall()
    return [{'language': row['language'], 'image_url': row['image_icon']} for row in rows]

# returns a list of categories for a specific project
def get_categories_for_project(db, project_id: int) -> list:
    rows = db.execute("""
        SELECT c.pk_category, c.category
        FROM categories c
        JOIN project_categories pc ON c.pk_category = pc.fk_category
        WHERE pc.fk_project = ?
    """, (project_id,)).fetchall()
    return [dict(row) for row in rows]

# returns a list of images associated with a specific project, including alt text
def get_images_for_project(db, project_id: int) -> list:
    rows = db.execute("""
        SELECT pk_image, image, alt_text
        FROM images
        WHERE fk_project = ?
        ORDER BY pk_image
    """, (project_id,)).fetchall()
    return [dict(row) for row in rows]

# returns the type of a specific porject, or None if not found
def get_type_for_project(db, project_id: int) -> str | None:
    row = db.execute("""
        SELECT t.type FROM types t
        JOIN project_types pt ON t.pk_type = pt.fk_type
        WHERE pt.fk_project = ?
    """, (project_id,)).fetchone()
    return row['type'] if row else None

# returns the descriptions for a specific project, or None if not found
def get_descriptions_for_project(db, project_id: int) -> list:
    rows = db.execute("""
        SELECT description FROM project_descriptions WHERE fk_project = ?
    """, (project_id,)).fetchall()
    return [dict(row) for row in rows]

# Routes

# returns a list of projects with the minimal data needed for the project cards
@projects_bp.get('')
def get_projects():
    db = get_db()

    rows = db.execute("""
        SELECT pk_project, name, slug, summary,
               thumbnail_image, start_date, end_date
        FROM projects
        ORDER BY pk_project
    """).fetchall()

    projects = []
    for row in rows:
        project = dict(row)
        project_id = project['pk_project']
        # Attach related data for each project using the helper functions.
        # easier to read instead of large SQL query with multiple joins
        project['id'] = project.pop('pk_project')
        project['thumbnail'] = {'url': project.pop('thumbnail_image'), 'alt_text': f"{project['name']} thumbnail"}
        # Attach related data
        project['languages'] = get_languages_for_project(db, project_id)
        project['categories'] = get_categories_for_project(db, project_id)
        type_val = get_type_for_project(db, project_id)
        project['type'] = {'type': type_val} if type_val else None
        projects.append(project)

    return jsonify(projects)

# returns the full details for a specific project for each proejcts page
@projects_bp.get('/<slug>')
def get_project(slug: str):
    db = get_db()

    row = db.execute("""
        SELECT pk_project, name, slug, summary,
            thumbnail_image, url,
            start_date, end_date
        FROM projects
        WHERE slug = ?
    """, (slug,)).fetchone()

    # if no project is found with the given slug return a 404 error
    if row is None:
        abort(404, description=f"No project found with slug '{slug}'")

    project = dict(row)
    project_id = project['pk_project']

    # retrieve all related data for the project via helper functions.
    project['descriptions'] = get_descriptions_for_project(db, project_id)
    project['languages'] = get_languages_for_project(db, project_id)
    project['categories'] = get_categories_for_project(db, project_id)
    project['images'] = get_images_for_project(db, project_id)
    project['type'] = get_type_for_project(db, project_id)
    project['thumbnail'] = {'url': project.pop('thumbnail_image'), 'alt_text': f"{project['name']} thumbnail"}

    return jsonify(project)

# returns the breif detials for a specific project from the returned slug
@projects_bp.get('/<slug>/brief')
def get_project_brief(slug: str):
    db = get_db()
    
    row = db.execute("""
        SELECT pk_project, name, slug, summary,
            thumbnail_image, start_date, end_date
        FROM projects
        WHERE slug = ?
    """, (slug,)).fetchone()
    
    if row is None:
        abort (404, description=f"No project found with slug '{slug}'")
        
    project = dict(row)
    project_id = project['pk_project']
    # Attach related data for each project using the helper functions.
    # easier to read instead of large SQL query with multiple joins
    project['id'] = project.pop('pk_project')
    project['thumbnail'] = {'url': project.pop('thumbnail_image'), 'alt_text': f"{project['name']} thumbnail"}
    # Attach related data
    project['languages'] = get_languages_for_project(db, project_id)
    project['categories'] = get_categories_for_project(db, project_id)
    type_val = get_type_for_project(db, project_id)
    project['type'] = {'type': type_val} if type_val else None
    
    return jsonify(project)
    