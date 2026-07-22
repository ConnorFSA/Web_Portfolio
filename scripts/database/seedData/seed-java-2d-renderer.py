# seed-web-portfolio.py

# data definitions: edit data here for new entries
PROJECT = {
    "name":            "Java 2D Renderer",
    "slug":            "java-2d-renderer",
    "summary":         "A Java 2D rendering engine that parses drawing commands to rasterise geometric shapes directly to a framebuffer, demonstrated through a fully playable Snake game.",
    "start_date":      "16-12-2025",
    "end_date":        None,
    "thumbnail_image": "/static/media/projects/java-2d-renderer/thumbnail/thumbnail.png",
    "url":             None,
}

# Array fo dictionaries with image and alt_text keys
IMAGES = [
    {
        "image": "/static/media/projects/vr-aviation-learning-tool/images/Screenshot 2025-10-15 211234.png",
        "alt_text": "Dynamic Ghost Trails - Visualising the path of the aircraft in 3D space"
    },
    {
        "image": "/static/media/projects/vr-aviation-learning-tool/images/Screenshot 2025-11-03 130945.png",
        "alt_text": "Force Arrows (Thrust, Lift, Drag, Weight, Centre of Pressure) - Visualise the forces acting on the aircraft in real time as Pitch changes."
    },
]

DESCRIPTIONS = [
    (
        "A software renderer built entirely in Java that reads a plain-text command file and "
        "rasterises primitive shapes — lines, rectangles, circles, and filled polygons — directly "
        "onto a framebuffer without relying on any graphics library. Each command maps to a "
        "low-level drawing routine that manually computes which pixels to colour, giving full "
        "control over how geometry is converted to a 2D pixel grid."
    ),
    (
        "To demonstrate the renderer in a dynamic context, a custom game loop was layered on top "
        "that clears and redraws the framebuffer on every tick at a fixed timestep. This loop "
        "drives a fully playable Snake game where the game state is described in a text file "
        "using the same drawing-command format, allowing the snake, food, and border to be "
        "expressed as primitive shapes rendered each frame."
    ),
]

# Array fo dictionaries with image and alt_text keys
IMAGES = [
    {
        "image": "/static/media/projects/java-2d-renderer/images/snake-game-1.png",
        "alt_text": "Screenshot of the Snake game running with the Java 2D renderer"
    },
    {
        "image": "/static/media/projects/java-2d-renderer/images/snake-game-2.png",
        "alt_text": "Screenshot of the Snake game running with the Java 2D renderer with the snake crossing the screen edge and appearing on the opposite side"
    },
    {
        "image": "/static/media/projects/java-2d-renderer/images/snake-game-3.png",
        "alt_text": "Screenshot of the Snake game running with the Java 2D renderer with alternate map size"
    },
    {
        "image": "/static/media/projects/java-2d-renderer/images/framebuffer-draw-command.png",
        "alt_text": "Example of primitive shapes being drawn to the framebuffer"
    },
    {
        "image": "/static/media/projects/java-2d-renderer/images/pixel-art.png",
        "alt_text": "Example of pixel art created with the Java 2D renderer"
    }
]

LANGUAGES = [
    {
        "language": "Java",
        "image_icon": "/static/media/icons/svg/languages/openjdk.svg"
    }
]
CATEGORIES = ["Graphics Programming", "Game Development"]
TYPES = ["2D Graphics Engine"]


# Main insert functionality: takes data from above and enters it into database

import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent.parent.parent.parent / "db/projects.db"


def upsert_language(cur, language, image_icon=None):
    cur.execute(
        """
        INSERT INTO languages (language, image_icon)
        VALUES (?, ?)
        ON CONFLICT(language) DO UPDATE SET
            image_icon = excluded.image_icon
        """,
        (language, image_icon)
    )


def upsert_category(cur, category):
    cur.execute(
        """
        INSERT INTO categories (category)
        VALUES (?)
        ON CONFLICT(category) DO NOTHING
        """,
        (category,)
    )


def get_or_create_type(cur, type_name):
    existing = cur.execute(
        "SELECT pk_type FROM types WHERE type = ? LIMIT 1",
        (type_name,)
    ).fetchone()

    if existing is not None:
        return existing[0]

    cur.execute(
        "INSERT INTO types (type) VALUES (?)",
        (type_name,)
    )
    return cur.execute(
        "SELECT pk_type FROM types WHERE type = ? LIMIT 1",
        (type_name,)
    ).fetchone()[0]


def seed(db_path):
    print(str(DB_PATH))

    con = sqlite3.connect(db_path)
    cur = con.cursor()

    for lang in LANGUAGES:
        upsert_language(cur, lang["language"], lang.get("image_icon"))

    for cat in CATEGORIES:
        upsert_category(cur, cat)

    for typ in TYPES:
        get_or_create_type(cur, typ)

    cur.execute(
        """
        INSERT INTO projects (name, slug, summary, start_date, end_date, thumbnail_image, url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(slug) DO UPDATE SET
            name = excluded.name,
            summary = excluded.summary,
            start_date = excluded.start_date,
            end_date = excluded.end_date,
            thumbnail_image = excluded.thumbnail_image,
            url = excluded.url
        """,
        (
            PROJECT["name"], PROJECT["slug"], PROJECT["summary"],
            PROJECT["start_date"], PROJECT["end_date"],
            PROJECT["thumbnail_image"], PROJECT["url"]
        )
    )

    project_id = cur.execute(
        "SELECT pk_project FROM projects WHERE slug = ?",
        (PROJECT["slug"],)
    ).fetchone()[0]

    cur.execute("DELETE FROM project_descriptions WHERE fk_project = ?", (project_id,))
    cur.execute("DELETE FROM images WHERE fk_project = ?", (project_id,))
    cur.execute("DELETE FROM project_languages WHERE fk_project = ?", (project_id,))
    cur.execute("DELETE FROM project_categories WHERE fk_project = ?", (project_id,))
    cur.execute("DELETE FROM project_types WHERE fk_project = ?", (project_id,))

    for desc in DESCRIPTIONS:
        cur.execute(
            "INSERT INTO project_descriptions (fk_project, description) VALUES (?, ?)",
            (project_id, desc)
        )

    for img in IMAGES:
        cur.execute(
            "INSERT INTO images (fk_project, image, alt_text) VALUES (?, ?, ?)",
            (project_id, img["image"], img["alt_text"])
        )

    for lang in LANGUAGES:
        lang_id = cur.execute(
            "SELECT pk_language FROM languages WHERE language = ?",
            (lang["language"],)
        ).fetchone()[0]
        cur.execute(
            "INSERT INTO project_languages (fk_project, fk_language) VALUES (?, ?)",
            (project_id, lang_id)
        )

    for cat in CATEGORIES:
        cat_id = cur.execute(
            "SELECT pk_category FROM categories WHERE category = ?",
            (cat,)
        ).fetchone()[0]
        cur.execute(
            "INSERT INTO project_categories (fk_project, fk_category) VALUES (?, ?)",
            (project_id, cat_id)
        )

    for typ in TYPES:
        type_id = get_or_create_type(cur, typ)
        cur.execute(
            "INSERT INTO project_types (fk_project, fk_type) VALUES (?, ?)",
            (project_id, type_id)
        )

    con.commit()
    con.close()
    print(f"Seeded: {PROJECT['name']}")


seed(DB_PATH)