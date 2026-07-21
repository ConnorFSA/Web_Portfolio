from flask import Blueprint, request, jsonify, abort
from app.routes.auth import require_admin
from app.db import get_db
 
 
admin_project_bp = Blueprint("admin_project", __name__, url_prefix="/api/admin/projects")
 