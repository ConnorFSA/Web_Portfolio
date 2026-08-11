def serialize_language(language_row):
    language = dict(language_row)
    language["id"] = language.pop("pk_language")
    language["image_url"] = language.pop("image_icon")
    return language