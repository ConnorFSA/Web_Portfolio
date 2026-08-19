import json

from app.data_access.component import (
    get_components_for_project,
    get_component_by_id,
    get_max_component_position,
    insert_component,
    update_component,
    delete_component,
    shift_positions_for_insert,
    shift_positions_for_update,
    get_images_by_ids,
)
from app.serializers.component import serialize_component_row


def get_resolved_components_for_project(db, project_id):
    component_rows = get_components_for_project(db, project_id)
    image_ids = []

    for row in component_rows:
        try:
            parsed = json.loads(row["config"])
        except Exception:
            parsed = {}
        if row["type"] == "carousel" and isinstance(parsed, dict):
            image_ids.extend(parsed.get("image_ids", []))

    images_by_id = {}
    if image_ids:
        images = get_images_by_ids(db, list(dict.fromkeys(image_ids)))
        images_by_id = {image["id"]: image for image in images}

    resolved = []
    for row in component_rows:
        component = serialize_component_row(row)
        if component["type"] == "carousel":
            config = component["config"].copy()
            image_ids = config.get("image_ids", [])
            config["images"] = [
                images_by_id[image_id]
                for image_id in image_ids
                if image_id in images_by_id
            ]
            component["config"] = config
        resolved.append(component)

    return resolved


def create_component(db, project_id, type_value, position=None, config=None):
    if config is None:
        raise ValueError("config is required")

    if position is None:
        position = get_max_component_position(db, project_id) + 1
    else:
        shift_positions_for_insert(db, project_id, position)

    component_id = insert_component(db, project_id, type_value, position, config)
    db.commit()
    return get_component_by_id(db, component_id)


def update_component_record(db, component_id, position=None, config=None):
    component = get_component_by_id(db, component_id)
    if component is None:
        return None

    if position is not None and position != component["position"]:
        shift_positions_for_update(db, component["project_id"], component["position"], position)

    updated = update_component(db, component_id, position=position, config=config)
    db.commit()
    return updated


def delete_component_record(db, component_id):
    delete_component(db, component_id)
    db.commit()
    return True
