import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent.parent.parent / "db/projects.db"
TABLE_NAME = "languages"

NAME_COLUMN = "language"
ICON_COLUMN = "image_icon"


def add_languages(language_map: dict):
    """
    language_map format:
        {
            "Python": "icons/python.svg",
            "Java": "",
        }
    """

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    new_entries = 0
    updated_entries = 0
    processed = 0

    for name, icon_path in language_map.items():
        processed += 1

        cursor.execute(
            f"SELECT {ICON_COLUMN} FROM {TABLE_NAME} WHERE {NAME_COLUMN} = ?",
            (name,)
        )

        result = cursor.fetchone()

        # insert new entry
        if result is None:
            cursor.execute(
                f"""
                INSERT INTO {TABLE_NAME} ({NAME_COLUMN}, {ICON_COLUMN})
                VALUES (?, ?)
                """,
                (name, icon_path or "")
            )
            new_entries += 1

        # update existing entry if icon path is different
        else:
            existing_icon = result[0]

            # only update if different
            if icon_path and icon_path != existing_icon:
                cursor.execute(
                    f"""
                    UPDATE {TABLE_NAME}
                    SET {ICON_COLUMN} = ?
                    WHERE {NAME_COLUMN} = ?
                    """,
                    (icon_path, name)
                )
                updated_entries += 1

    conn.commit()
    conn.close()

    return {
        "processed": processed,
        "new": new_entries,
        "updated": updated_entries
    }