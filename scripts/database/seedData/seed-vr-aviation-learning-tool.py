# seed-web-portfolio.py

# data definitions: edit data here for new entries
PROJECT = {
    "name":            "VR Aviation Learning Application",
    "slug":            "vr-aviation-learning-tool",
    "summary":         "A Virtual Reality application to teach key aviation theory concepts in an interactive and visual medium.",
    "start_date":      "30-07-2025",
    "end_date":        "19-11-2025",
    "thumbnail_image": "/static/media/projects/vr-aviation-learning-tool/thumbnail/Screenshot 2025-11-14 155335.png",
    "url":             None,
}

DESCRIPTIONS = [
    (
        "This project was a collaborative VR learning application developed by a team of three for a PhD candidate "
        "researching whether virtual reality could improve knowledge retention for aviation students compared to more "
        "traditional classroom methods. The application was structured into six distinct sections, each covering a "
        "different aviation concept and theoretical topic. These sections combined guided activities with visual "
        "demonstrations, allowing students to adjust aircraft variables such as pitch, bank, speed, or combinations of "
        "these inputs to explore the resulting effects in real time. Features included force visualisation, narrated "
        "explanations, and interactive learning modules that guided users through key manoeuvres such as recovering "
        "from a stall and turning the aircraft. The experience used both procedural and standard animations, alongside "
        "basic VR controls, to create a clear and engaging learning environment. To reduce motion sickness and improve "
        "accessibility, the aircraft remained largely stationary while movement was visualised through a dynamic ghost "
        "trail that mapped the aircraft’s path through the scene. This made the experience more approachable for users "
        "with little or no prior VR experience. As a team, we met with our client on a weekly basis and delivered "
        "incremental MVPs every two weeks, using Jira to manage progress and maintain an agile workflow. The project was "
        "designed to run on the Meta Quest 3, and it was ultimately entered into the 2025 STEM Expo where it won Best "
        "Undergraduate IT Project."
    ),
    (
        "My contribution focused on the technical systems that made the aviation concepts more understandable in a VR "
        "environment. I developed a procedural airflow system that visualised how air moved across the wing, showing "
        "both the direction of the airflow and the changes in flow speed as the user adjusted the aircraft’s bank angle. "
        "As the bank increased, the airflow separated from the top of the wing and became turbulent before a stall, "
        "giving users a direct visual cue of the changing aerodynamic behaviour. I also updated the team’s ghost trail "
        "system so it could respond to both pitch and bank changes, with the trail curving more dramatically as the bank "
        "angle increased. In addition to that, I created helper functions for plane movement and animation control, "
        "including easing and controller-driven interaction methods to support smoother, more responsive VR input. I "
        "built the animation setup and core interaction logic for three of the main learning sections and contributed "
        "smaller improvements across the rest of the project. I also implemented a force visualisation system in which "
        "arrows expanded and contracted according to the forces acting on the aircraft during changes in angle of attack. "
        "This included a centre-of-pressure arrow that shifted along the wing to show how the aerodynamic centre moved "
        "as the aircraft’s conditions changed."
    ),
]

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
    {
        "image": "/static/media/projects/vr-aviation-learning-tool/images/Screenshot 2025-11-03 131444.png",
        "alt_text": "Dynamic airflow visualisation - Visualise how airflow changes and separates from the aircraft as the angle of attack changes."
    },
    {
        "image": "/static/media/projects/vr-aviation-learning-tool/images/Screenshot 2025-11-03 141057.png",
        "alt_text": "Dynamic Ghost Trails - Visualising the turn radius of the aircraft as pitch and bank change."
    },
    {
        "image": "/static/media/projects/vr-aviation-learning-tool/images/Screenshot 2025-11-03 141828.png",
        "alt_text": "Ghost trails - Aircraft at a neutral pitch and bank."
    },
    {
        "image": "/static/media/projects/vr-aviation-learning-tool/images/Screenshot 2025-11-03 143042.png",
        "alt_text": "Player in VR - The player working through first learning module."
    }
]

LANGUAGES = [
    {
        "language": "C#",
        "image_icon": "/static/media/icons/svg/languages/dotnet.svg"
    }
]
CATEGORIES = ["University", "Education", "Game Development"]
TYPES = ["VR Application"]


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