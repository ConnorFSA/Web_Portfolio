
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
        {"language": row["language"], "image_url": row["image_icon"]}
        for row in rows
    ]


def get_categories_for_project(db, project_id):
    rows = db.execute(
        """
        SELECT c.pk_category, c.category
        FROM categories c
        JOIN project_categories pc ON c.pk_category = pc.fk_category
        WHERE pc.fk_project = ?
        """,
        (project_id,),
    ).fetchall()
    return [dict(row) for row in rows]


def get_images_for_project(db, project_id):
    rows = db.execute(
        """
        SELECT pk_image, image, alt_text
        FROM images
        WHERE fk_project = ?
        ORDER BY pk_image
        """,
        (project_id,),
    ).fetchall()
    return [dict(row) for row in rows]


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
