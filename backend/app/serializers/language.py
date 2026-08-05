def serialize_language(language_row):
    language = dict(language_row)
    language["id"] = language.pop("pk_language")
    return language