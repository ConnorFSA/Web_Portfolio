# seed-web-portfolio.py

# data definitions: edit data here for new entries
PROJECT = {
    "name":            "Java 2D Renderer",
    "slug":            "java-2d-renderer",
    "summary":         "A Java 2D rendering engine that parses custom drawing commands from text files to rasterise geometric shapes directly to a framebuffer, demonstrated through a fully playable Snake game.",
    "start_date":      "16-12-2025",
    "end_date":        None,
    "thumbnail_image": "/static/media/projects/java-2d-renderer/thumbnail/thumbnail.png",
    "url":             None,
}

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

LANGUAGES   = ["Java"]
CATEGORIES  = ["Graphics Programming", "Game Development"]
TYPES       = ["2D Graphics Engine"]

# New shared entries — skipped automatically if they already exist
# array of dictionaries with a langauge key and image_icon key
NEW_LANGUAGES = []
NEW_CATEGORIES = ["Graphics Programming", "Game Development"]
NEW_TYPES      = ["2D Graphics Engine"]


# Main insert functionality: takes data from above and enters it into database

import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent.parent.parent.parent / "db/projects.db"

def seed(db_path):
    print(str(DB_PATH))
    
    con = sqlite3.connect(db_path)
    cur = con.cursor()

    # Insert shared data, skip if already exists
    for lang in NEW_LANGUAGES:
        cur.execute("INSERT OR IGNORE INTO languages (language, image_icon) VALUES (?, ?)",
                    (lang["language"], lang["image_icon"]))

    for cat in NEW_CATEGORIES:
        cur.execute("INSERT OR IGNORE INTO categories (category) VALUES (?)", (cat,))

    for typ in NEW_TYPES:
        cur.execute("INSERT OR IGNORE INTO types (type) VALUES (?)", (typ,))

    
    # Insert project
    cur.execute("""
        INSERT INTO projects (name, slug, summary, start_date, end_date, thumbnail_image, url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        PROJECT["name"], PROJECT["slug"], PROJECT["summary"],
        PROJECT["start_date"], PROJECT["end_date"],
        PROJECT["thumbnail_image"], PROJECT["url"]
    ))

    project_id = cur.execute(
        "SELECT pk_project FROM projects WHERE slug = ?", (PROJECT["slug"],)
    ).fetchone()[0]

    # Descriptions
    for desc in DESCRIPTIONS:
        cur.execute("INSERT INTO project_descriptions (fk_project, description) VALUES (?, ?)",
                    (project_id, desc))

    # Images
    for img in IMAGES:
        cur.execute("INSERT INTO images (fk_project, image, alt_text) VALUES (?, ?, ?)",
                    (project_id, img["image"], img["alt_text"]))

    # Junction tables — look up PKs by name automatically
    for lang in LANGUAGES:
        lang_id = cur.execute(
            "SELECT pk_language FROM languages WHERE language = ?", (lang,)
        ).fetchone()[0]
        cur.execute("INSERT INTO project_languages (fk_project, fk_language) VALUES (?, ?)",
                    (project_id, lang_id))

    for cat in CATEGORIES:
        cat_id = cur.execute(
            "SELECT pk_category FROM categories WHERE category = ?", (cat,)
        ).fetchone()[0]
        cur.execute("INSERT INTO project_categories (fk_project, fk_category) VALUES (?, ?)",
                    (project_id, cat_id))

    for typ in TYPES:
        type_id = cur.execute(
            "SELECT pk_type FROM types WHERE type = ?", (typ,)
        ).fetchone()[0]
        cur.execute("INSERT INTO project_types (fk_project, fk_type) VALUES (?, ?)",
                    (project_id, type_id))

    con.commit()
    con.close()
    print(f"Seeded: {PROJECT['name']}")

seed(DB_PATH)