# seed-web-portfolio.py

# data definitions: edit data here for new entries
PROJECT = {
    "name":            "Web Portfolio",
    "slug":            "web-portfolio",
    "summary":         "A full-stack portfolio built with React and Flask.",
    "start_date":      "16-12-2025",
    "end_date":        None,
    "thumbnail_image": "/static/media/projects/web-portfolio/thumbnail/13-05-2026_development-project-page.png",
    "url":             "https://github.com/ConnorFSA/Web_Portfolio",
}

DESCRIPTIONS = [
    "This portfolio is a full-stack web application designed to showcase projects in an interactive and visually polished interface. The frontend is built with React 18 and TypeScript using Vite for fast bundling, and uses React Router for client-side navigation. Key features include a production-grade image carousel with autoplay and smooth CSS transitions. A custom theming system lets users switch between colour palettes, each with a dark and light mode variation, with preferences persisted via localStorage. Projects are browsable in a responsive grid, and each project links to a detailed view with images, tech stack, and descriptions. I have designed each aspect of the project from the ground up to expand my understanding of web technologies, employing standard design principles to ensure the project remains maintainable and extensible as I continue development.",
    "The backend is a Python Flask API connected to a normalised SQLite database. The relational schema manages projects, languages, categories, images, summaries, and descriptions through dedicated tables and many-to-many junction tables. The frontend interfaces with the backend through a RESTful API to retrieve structured JSON data, handled via custom React hooks that manage loading and error states. The project follows modular architecture principles, separating frontend and backend concerns through reusable components, type-safe data contracts between the API and UI, and CSS variables for scalable theming. The site is deployed on an AWS EC2 instance behind Nginx, with SSL/TLS encryption for HTTPS support. API and media requests are forwarded to Gunicorn, a production-ready WSGI server that translates HTTP requests for Flask. Both services are initialised on boot via a systemd daemon, ensuring the application can recover automatically after an unexpected failure. Using GitHub Actions, I have created a CI/CD pipeline that automatically reloads and updates the production server when changes are pushed to any service.",
]

# Array fo dictionaries with image and alt_text keys
IMAGES = []

LANGUAGES = [
    {"language": "JavaScript", "image_icon": "/static/media/icons/svg/languages/javascript.svg"},
    {"language": "TypeScript", "image_icon": "/static/media/icons/svg/languages/typescript.svg"},
    {"language": "Python", "image_icon": "/static/media/icons/svg/languages/python.svg"},
    {"language": "SQL", "image_icon": ""},
    {"language": "CSS", "image_icon": "/static/media/icons/svg/languages/css.svg"},
]
CATEGORIES = ["Web Development", "Full Stack", "CI/CD", "REST"]
TYPES = ["Web App"]


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