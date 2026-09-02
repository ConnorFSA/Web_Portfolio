
# The data access layer is responsible for retrieving the raw rows from SQLite and
# shaping them into the structures the service layer expects.
def get_projects_raw(db):
    return db.execute(
        """
        SELECT pk_project, name, slug, summary,
               thumbnail_image, start_date, end_date
        FROM projects
        ORDER BY pk_project
        """
    ).fetchall()


def get_project_by_slug_raw(db, slug):
    return db.execute(
        """
        SELECT pk_project, name, slug, summary,
               thumbnail_image, url,
               start_date, end_date
        FROM projects
        WHERE slug = ?
        """,
        (slug,),
    ).fetchone()


def get_project_brief_by_slug_raw(db, slug):
    return db.execute(
        """
        SELECT pk_project, name, slug, summary,
               thumbnail_image, start_date, end_date
        FROM projects
        WHERE slug = ?
        """,
        (slug,),
    ).fetchone()


def get_languages_for_project(db, project_id):
    rows = db.execute(
        """
        SELECT l.pk_language, l.language, l.image_icon
        FROM languages l
        JOIN project_languages pl ON l.pk_language = pl.fk_language
        WHERE pl.fk_project = ?
        """,
        (project_id,),
    ).fetchall()
    return [
        {"id": row["pk_language"], "language": row["language"], "image_url": row["image_icon"]}
        for row in rows
    ]


def get_categories_for_project(db, project_id):
    rows = db.execute(
        """
        SELECT c.pk_category AS id, c.category
        FROM categories c
        JOIN project_categories pc ON c.pk_category = pc.fk_category
        WHERE pc.fk_project = ?
        """,
        (project_id,),
    ).fetchall()
    return [dict(row) for row in rows]


def get_type_ids_for_project(db, project_id):
    rows = db.execute(
        """
        SELECT fk_type AS id
        FROM project_types
        WHERE fk_project = ?
        ORDER BY fk_type
        """,
        (project_id,),
    ).fetchall()
    return [row["id"] for row in rows]


def get_all_categories(db):
    return [dict(row) for row in db.execute(
        "SELECT pk_category AS id, category FROM categories ORDER BY category"
    ).fetchall()]


def get_all_languages(db):
    return [dict(row) for row in db.execute(
        "SELECT pk_language AS id, language, image_icon AS image_url FROM languages ORDER BY language"
    ).fetchall()]


def get_all_tools(db):
    return [dict(row) for row in db.execute(
        "SELECT pk_tool AS id, tool, image_icon AS image_url FROM tools ORDER BY tool"
    ).fetchall()]


def get_all_types(db):
    return [dict(row) for row in db.execute(
        "SELECT pk_type AS id, type FROM types ORDER BY type"
    ).fetchall()]


def get_tools_for_project(db, project_id):
    rows = db.execute(
        """
        SELECT t.pk_tool AS id, t.tool, t.image_icon AS image_url
        FROM tools t JOIN project_tools pt ON t.pk_tool = pt.fk_tool
        WHERE pt.fk_project = ? ORDER BY t.tool
        """,
        (project_id,),
    ).fetchall()
    return [dict(row) for row in rows]


def get_project_by_id(db, project_id):
    row = db.execute(
        """
        SELECT pk_project, name, slug, summary, thumbnail_image, url, start_date, end_date
        FROM projects WHERE pk_project = ?
        """,
        (project_id,),
    ).fetchone()
    return dict(row) if row else None


def replace_project_links(db, project_id, table, column, values):
    db.execute(f"DELETE FROM {table} WHERE fk_project = ?", (project_id,))
    db.executemany(
        f"INSERT INTO {table} (fk_project, {column}) VALUES (?, ?)",
        [(project_id, value) for value in values],
    )


def update_project_record(db, project_id, fields):
    assignments = ", ".join(f"{field} = ?" for field in fields)
    db.execute(
        f"UPDATE projects SET {assignments} WHERE pk_project = ?",
        (*fields.values(), project_id),
    )
    db.commit()


def update_image_alt_text(db, project_id, image_id, alt_text):
    cursor = db.execute(
        "UPDATE images SET alt_text = ? WHERE pk_image = ? AND fk_project = ?",
        (alt_text, image_id, project_id),
    )
    if cursor.rowcount == 0:
        return None
    db.commit()
    row = db.execute(
        "SELECT pk_image AS id, image, alt_text FROM images WHERE pk_image = ?",
        (image_id,),
    ).fetchone()
    return dict(row)


def insert_project(db, fields):
    cursor = db.execute(
        """
        INSERT INTO projects (name, slug, summary, start_date, end_date, thumbnail_image, url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        tuple(fields[field] for field in ("name", "slug", "summary", "start_date", "end_date", "thumbnail_image", "url")),
    )
    db.commit()
    return get_project_by_id(db, cursor.lastrowid)


def get_images_for_project(db, project_id):
    rows = db.execute(
        """
        SELECT pk_image AS id, image, alt_text
        FROM images
        WHERE fk_project = ?
        ORDER BY pk_image
        """,
        (project_id,),
    ).fetchall()
    return [dict(row) for row in rows]


def insert_image(db, project_id, image, alt_text):
    cursor = db.execute(
        """
        INSERT INTO images (fk_project, image, alt_text)
        VALUES (?, ?, ?)
        """,
        (project_id, image, alt_text),
    )
    db.commit()
    row = db.execute(
        """
        SELECT pk_image AS id, image, alt_text
        FROM images
        WHERE pk_image = ?
        """,
        (cursor.lastrowid,),
    ).fetchone()
    return dict(row)


def get_type_for_project(db, project_id):
    row = db.execute(
        """
        SELECT t.type FROM types t
        JOIN project_types pt ON t.pk_type = pt.fk_type
        WHERE pt.fk_project = ?
        """,
        (project_id,),
    ).fetchone()
    return row["type"] if row else None


def get_descriptions_for_project(db, project_id):
    rows = db.execute(
        """
        SELECT description FROM project_descriptions WHERE fk_project = ?
        """,
        (project_id,),
    ).fetchall()
    return [dict(row) for row in rows]
