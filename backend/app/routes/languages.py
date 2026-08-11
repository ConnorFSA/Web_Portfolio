from flask import Blueprint, jsonify, abort
from app.db import get_db
from app.services.languages import (
    get_all_languages,
    get_language_by_name,
)
from app.serializers.language import serialize_language;

languages_bp = Blueprint('languages', __name__, url_prefix='/api/languages')

@languages_bp.get('')
def get_languages():
    db = get_db()
    languages = get_all_languages(db)
    return jsonify([serialize_language(lang) for lang in languages])

@languages_bp.get('/<name>')
def get_language(name: str):
    db = get_db()
    language = get_language_by_name(db, name)
    if language is None:
        abort(404, description=f"No language found with name '{name}'")
    return jsonify(serialize_language(language))