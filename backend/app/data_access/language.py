def get_languages(db):
    return db.execute("SELECT * FROM languages").fetchall()

def get_language_by_name(db, name):
    return db.execute(
        """
        SELECT * FROM languages
        WHERE language = ?
        """,
        (name,),
    ).fetchone()
    