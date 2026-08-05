from app.data_access.language import (
    get_languages,
    get_language_by_slug,
)
from app.serializers.language import serialize_language

def get_all_languages(db):
    return get_languages(db)

def get_language_by_name(db, name):
    language = get_language_by_name(db, name)
    return serialize_language(language)