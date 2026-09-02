import os
import uuid
from sqlite3 import IntegrityError
from flask import Blueprint, request, jsonify, abort, current_app
from werkzeug.utils import secure_filename
from app.routes.auth import require_admin
from app.db import get_db
from app.data_access.project import (
    get_all_categories,
    get_all_languages,
    get_all_tools,
    get_all_types,
    get_images_for_project,
    get_project_by_id,
    get_tools_for_project,
    insert_image,
    replace_project_links,
    update_image_alt_text,
)
from app.services.component import (
    create_component,
    delete_component_record,
    update_component_record,
)
from app.data_access.component import get_component_by_id


admin_project_bp = Blueprint("admin_project", __name__, url_prefix="/api/admin/projects")

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}

# These validation helpers ensure that relationship payloads are structurally sound
# before they are persisted to the database.
def _validate_id_list(data, field):
    values = data.get(field, [])
    if not isinstance(values, list) or any(not isinstance(value, int) for value in values):
        abort(400, description=f"{field} must be a list of integer IDs")
    if len(values) != len(set(values)):
        abort(400, description=f"{field} must not contain duplicate IDs")
    return values


def _validate_catalog_ids(db, table, column, values, field):
    if not values:
        return
    placeholders = ",".join("?" for _ in values)
    row = db.execute(
        f"SELECT COUNT(*) AS count FROM {table} WHERE {column} IN ({placeholders})",
        tuple(values),
    ).fetchone()
    if row["count"] != len(values):
        abort(400, description=f"One or more {field} IDs are invalid")


def _project_response(db, project_id):
    # The API response includes both the project record and the associated ids for
    # categories, languages, tools, and types so the frontend can rehydrate the form.
    project = get_project_by_id(db, project_id)
    project["category_ids"] = [item["id"] for item in db.execute(
        "SELECT fk_category AS id FROM project_categories WHERE fk_project = ?",
        (project_id,),
    ).fetchall()]
    project["language_ids"] = [item["id"] for item in db.execute(
        "SELECT fk_language AS id FROM project_languages WHERE fk_project = ?",
        (project_id,),
    ).fetchall()]
    project["tool_ids"] = [item["id"] for item in db.execute(
        "SELECT fk_tool AS id FROM project_tools WHERE fk_project = ?",
        (project_id,),
    ).fetchall()]
    project["type_ids"] = [item["id"] for item in db.execute(
        "SELECT fk_type AS id FROM project_types WHERE fk_project = ?",
        (project_id,),
    ).fetchall()]
    project["images"] = get_images_for_project(db, project_id)
    return project


def _require_project_exists(db, project_id):
    project = db.execute(
        "SELECT 1 FROM projects WHERE pk_project = ?",
        (project_id,),
    ).fetchone()
    if project is None:
        abort(404, description=f"Project with id {project_id} not found")


@admin_project_bp.route("/options", methods=["GET"])
@require_admin
def get_project_options():
    db = get_db()
    return jsonify({
        "categories": get_all_categories(db),
        "languages": get_all_languages(db),
        "tools": get_all_tools(db),
        "types": get_all_types(db),
    })


@admin_project_bp.route("", methods=["POST"])
@require_admin
def create_project():
    db = get_db()
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        abort(400, description="JSON body required")

    name = data.get("name", "").strip()
    slug = data.get("slug", "").strip()
    start_date = data.get("start_date", "").strip()
    if not name or not slug or not start_date:
        abort(400, description="name, slug, and start_date are required")

    category_ids = _validate_id_list(data, "category_ids")
    language_ids = _validate_id_list(data, "language_ids")
    tool_ids = _validate_id_list(data, "tool_ids")
    type_ids = _validate_id_list(data, "type_ids")
    _validate_catalog_ids(db, "categories", "pk_category", category_ids, "category")
    _validate_catalog_ids(db, "languages", "pk_language", language_ids, "language")
    _validate_catalog_ids(db, "tools", "pk_tool", tool_ids, "tool")
    _validate_catalog_ids(db, "types", "pk_type", type_ids, "type")

    try:
        cursor = db.execute(
            """
            INSERT INTO projects (name, slug, summary, start_date, end_date, thumbnail_image, url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (name, slug, data.get("summary", "").strip(), start_date,
             data.get("end_date") or None, data.get("thumbnail_image", "").strip() or None,
             data.get("url", "").strip() or None),
        )
        project_id = cursor.lastrowid
        replace_project_links(db, project_id, "project_categories", "fk_category", category_ids)
        replace_project_links(db, project_id, "project_languages", "fk_language", language_ids)
        replace_project_links(db, project_id, "project_tools", "fk_tool", tool_ids)
        replace_project_links(db, project_id, "project_types", "fk_type", type_ids)
        db.commit()
    except IntegrityError:
        db.rollback()
        abort(409, description="A project with that slug already exists")

    return jsonify(_project_response(db, project_id)), 201


@admin_project_bp.route("/<int:project_id>", methods=["PATCH"])
@require_admin
def update_project_metadata(project_id):
    db = get_db()
    _require_project_exists(db, project_id)
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        abort(400, description="JSON body required")

    fields = {}
    for field in ("name", "slug", "summary", "start_date", "end_date", "thumbnail_image", "url"):
        if field in data:
            value = data[field]
            if field in ("name", "slug", "start_date") and (not isinstance(value, str) or not value.strip()):
                abort(400, description=f"{field} must be a non-empty string")
            fields[field] = value.strip() if isinstance(value, str) else value
    if not fields and not any(key in data for key in ("category_ids", "language_ids", "tool_ids", "type_ids")):
        abort(400, description="At least one project field or relationship list is required")

    relationship_lists = {
        "category_ids": ("project_categories", "fk_category", "categories", "pk_category"),
        "language_ids": ("project_languages", "fk_language", "languages", "pk_language"),
        "tool_ids": ("project_tools", "fk_tool", "tools", "pk_tool"),
        "type_ids": ("project_types", "fk_type", "types", "pk_type"),
    }
    try:
        for field, (_, _, table, column) in relationship_lists.items():
            if field in data:
                values = _validate_id_list(data, field)
                _validate_catalog_ids(db, table, column, values, field.removesuffix("_ids"))
                relationship_lists[field] = (*relationship_lists[field][:2], values)
        if fields:
            assignments = ", ".join(f"{field} = ?" for field in fields)
            db.execute(f"UPDATE projects SET {assignments} WHERE pk_project = ?", (*fields.values(), project_id))
        for field, relationship in relationship_lists.items():
            if field in data:
                replace_project_links(db, project_id, relationship[0], relationship[1], relationship[2])
        db.commit()
    except IntegrityError:
        db.rollback()
        abort(409, description="A project with that slug already exists")

    return jsonify(_project_response(db, project_id))


@admin_project_bp.route("/<int:project_id>/images/<int:image_id>", methods=["PATCH"])
@require_admin
def update_project_image(project_id, image_id):
    db = get_db()
    _require_project_exists(db, project_id)
    data = request.get_json(silent=True)
    alt_text = data.get("alt_text", "").strip() if isinstance(data, dict) else ""
    if not alt_text:
        abort(400, description="alt_text is required")
    image = update_image_alt_text(db, project_id, image_id, alt_text)
    if image is None:
        abort(404, description="Image not found for project")
    return jsonify(image)


@admin_project_bp.route("/<int:project_id>/images", methods=["POST"])
@require_admin
def upload_project_image(project_id):
    db = get_db()
    _require_project_exists(db, project_id)

    uploaded_file = request.files.get("file")
    if uploaded_file is None or not uploaded_file.filename:
        abort(400, description="An image file is required")

    extension = os.path.splitext(uploaded_file.filename)[1].lower()
    if extension not in ALLOWED_IMAGE_EXTENSIONS:
        abort(400, description="Unsupported image type")

    alt_text = request.form.get("alt_text", "").strip()
    if not alt_text:
        abort(400, description="Alt text is required")

    filename = f"{uuid.uuid4().hex}{extension}"
    media_directory = os.path.join(current_app.static_folder, "media", "projects", str(project_id))
    os.makedirs(media_directory, exist_ok=True)
    uploaded_file.save(os.path.join(media_directory, secure_filename(filename)))

    image_url = f"/static/media/projects/{project_id}/{filename}"
    return jsonify(insert_image(db, project_id, image_url, alt_text)), 201


def _validate_component_payload(data, allow_optional_position=False):
    if not data or not isinstance(data, dict):
        abort(400, description="JSON body required")

    type_value = data.get("type")
    config = data.get("config")
    position = data.get("position")

    if not type_value or not isinstance(type_value, str):
        abort(400, description="Component type is required and must be a string")

    if config is None or not isinstance(config, dict):
        abort(400, description="Component config is required and must be an object")

    if position is not None:
        if not isinstance(position, int) or position < 1:
            abort(400, description="Position must be a positive integer")
    elif not allow_optional_position:
        position = None

    return type_value, position, config


@admin_project_bp.route("/<int:project_id>/components", methods=["POST"])
@require_admin
def create_project_component(project_id):
    db = get_db()
    _require_project_exists(db, project_id)
    type_value, position, config = _validate_component_payload(
        request.get_json(silent=True), allow_optional_position=True
    )

    component = create_component(db, project_id, type_value, position, config)
    serialized = {
        "id": component["pk_component"],
        "project_id": component["project_id"],
        "position": component["position"],
        "type": component["type"],
        "config": __import__("json").loads(component["config"]),
    }
    return jsonify(serialized), 201


@admin_project_bp.route("/<int:project_id>/components/<int:component_id>", methods=["PATCH"])
@require_admin
def update_project_component(project_id, component_id):
    db = get_db()
    _require_project_exists(db, project_id)
    existing = get_component_by_id(db, component_id)
    if existing is None or existing["project_id"] != project_id:
        abort(404, description=f"Component {component_id} not found for project {project_id}")

    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        abort(400, description="JSON body required")

    position = data.get("position")
    config = data.get("config")

    if position is None and config is None:
        abort(400, description="At least one of position or config must be provided")
    if position is not None and (not isinstance(position, int) or position < 1):
        abort(400, description="Position must be a positive integer")
    if config is not None and not isinstance(config, dict):
        abort(400, description="Component config must be an object")

    updated = update_component_record(db, component_id, position=position, config=config)
    serialized = {
        "id": updated["pk_component"],
        "project_id": updated["project_id"],
        "position": updated["position"],
        "type": updated["type"],
        "config": __import__("json").loads(updated["config"]),
    }
    return jsonify(serialized)

@admin_project_bp.route("/<int:project_id>/components/updateall", methods=["PATCH"])
@require_admin
def update_all_project_components(project_id):
    db = get_db()
    _require_project_exists(db, project_id)
    data = request.get_json(silent=True)
    if not data or not isinstance(data, list):
        abort(400, description="JSON body must be a list of components to update")
    serialized_components = []
    # Validate each component in the list
    for component_data in data:
        if not isinstance(component_data, dict):
            abort(400, description="Each component must be an object")
        component_id = component_data.get("id")
        if not component_id or not isinstance(component_id, int):
            abort(400, description="Each component must have a valid integer id")
        position = component_data.get("position")
        config = component_data.get("config")
        if position is None and config is None:
            abort(400, description=f"Component {component_id} must have at least one of position or config to update")
        if position is not None and (not isinstance(position, int) or position < 0):
            abort(400, description=f"Component {component_id} has invalid position; must be a positive integer")
        if config is not None and not isinstance(config, dict):
            abort(400, description=f"Component {component_id} has invalid config; must be an object")
        
        existing = get_component_by_id(db, component_id)
        if existing is None or existing["project_id"] != project_id:
            abort(404, description=f"Component {component_id} not found for project {project_id}")

        # perform update and fetch the updated record once
        update_component_record(db, component_id, position=position, config=config)
        updated = get_component_by_id(db, component_id)
        serialized_components.append(
            {
                "id": updated["pk_component"],
                "project_id": updated["project_id"],
                "position": updated["position"],
                "type": updated["type"],
                "config": __import__("json").loads(updated["config"]),
            }
        )
    # return the list of updated components
    return jsonify(serialized_components), 200

@admin_project_bp.route("/<int:project_id>/components/<int:component_id>", methods=["DELETE"])
@require_admin
def delete_project_component(project_id, component_id):
    db = get_db()
    _require_project_exists(db, project_id)
    existing = get_component_by_id(db, component_id)
    if existing is None or existing["project_id"] != project_id:
        abort(404, description=f"Component {component_id} not found for project {project_id}")

    delete_component_record(db, component_id)
    return jsonify({"deleted": True}), 200
 