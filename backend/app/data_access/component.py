import json

# Component access functions manage the ordered, JSON-backed content blocks that make
# up a project's structure.
def get_components_for_project(db, project_id):
    rows = db.execute(
        """
        SELECT pk_component, project_id, position, type, config
        FROM components
        WHERE project_id = ?
        ORDER BY position
        """,
        (project_id,),
    ).fetchall()
    return [dict(row) for row in rows]


def get_component_by_id(db, component_id):
    row = db.execute(
        """
        SELECT pk_component, project_id, position, type, config
        FROM components
        WHERE pk_component = ?
        """,
        (component_id,),
    ).fetchone()
    return dict(row) if row else None


def get_max_component_position(db, project_id):
    row = db.execute(
        """
        SELECT MAX(position) AS max_position
        FROM components
        WHERE project_id = ?
        """,
        (project_id,),
    ).fetchone()
    return row["max_position"] if row and row["max_position"] is not None else 0


def shift_positions_for_insert(db, project_id, position):
    db.execute(
        """
        UPDATE components
        SET position = position + 1
        WHERE project_id = ? AND position >= ?
        """,
        (project_id, position),
    )


def shift_positions_for_update(db, project_id, old_position, new_position):
    if new_position == old_position:
        return

    if new_position < old_position:
        db.execute(
            """
            UPDATE components
            SET position = position + 1
            WHERE project_id = ? AND position >= ? AND position < ?
            """,
            (project_id, new_position, old_position),
        )
    else:
        db.execute(
            """
            UPDATE components
            SET position = position - 1
            WHERE project_id = ? AND position > ? AND position <= ?
            """,
            (project_id, old_position, new_position),
        )


def insert_component(db, project_id, type_value, position, config):
    config_json = json.dumps(config)
    cursor = db.execute(
        """
        INSERT INTO components (project_id, position, type, config)
        VALUES (?, ?, ?, ?)
        """,
        (project_id, position, type_value, config_json),
    )
    return cursor.lastrowid


def update_component(db, component_id, position=None, config=None):
    if position is None and config is None:
        return get_component_by_id(db, component_id)

    fields = []
    params = []

    if position is not None:
        fields.append("position = ?")
        params.append(position)

    if config is not None:
        fields.append("config = ?")
        params.append(json.dumps(config))

    fields.append("updated_at = datetime('now')")
    params.append(component_id)

    db.execute(
        f"UPDATE components SET {', '.join(fields)} WHERE pk_component = ?",
        tuple(params),
    )
    return get_component_by_id(db, component_id)


def delete_component(db, component_id):
    db.execute(
        "DELETE FROM components WHERE pk_component = ?",
        (component_id,),
    )


def get_images_by_ids(db, project_id, image_ids):
    if not image_ids:
        return []

    placeholders = ",".join("?" for _ in image_ids)
    rows = db.execute(
        f"""
        SELECT pk_image AS id, image, alt_text
        FROM images
        WHERE fk_project = ? AND pk_image IN ({placeholders})
        ORDER BY pk_image
        """,
        (project_id, *image_ids),
    ).fetchall()
    return [dict(row) for row in rows]
