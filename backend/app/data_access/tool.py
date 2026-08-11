def get_tools(db):
    return db.execute("SELECT * FROM tools").fetchall()

def get_tool_by_name(db, name):
    return db.execute(
        """
        SELECT * FROM tools
        WHERE tool = ?
        """,
        (name,),
    ).fetchone()