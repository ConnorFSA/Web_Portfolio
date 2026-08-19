from flask import Blueprint, request, jsonify, abort
from app.routes.auth import require_admin
from app.db import get_db
from app.services.component import (
    create_component,
    delete_component_record,
    update_component_record,
)
from app.data_access.component import get_component_by_id


admin_project_bp = Blueprint("admin_project", __name__, url_prefix="/api/admin/projects")


def _require_project_exists(db, project_id):
    project = db.execute(
        "SELECT 1 FROM projects WHERE pk_project = ?",
        (project_id,),
    ).fetchone()
    if project is None:
        abort(404, description=f"Project with id {project_id} not found")


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
 