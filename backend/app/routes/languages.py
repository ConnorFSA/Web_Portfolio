from flask import Blueprint, jsonify, abort
from app.db import get_db
from app.services.languages import (
    get_all_languages,
    get_language_by_name,
)

languages_bp = Blueprint('languages', __name__, url_prefix='/api/languages')

@languages_bp.get('')
def get_languages():
    db = get_db()
    languages = get_all_languages(db)
    return jsonify(languages)

@languages_bp.get('/<slug>')
def get_language(name: str):
    db = get_db()
    language = get_language_by_name(db, name)
    if language is None:
        abort(404, description=f"No language found with name '{name}'")
    return jsonify(language)