from flask import Blueprint, jsonify, abort
from app.db import get_db
from app.services.tools import (
    get_all_tools,
    get_tool_by_name,
)
from app.serializers.tool import serialize_tool

tools_bp = Blueprint('tools', __name__, url_prefix='/api/tools')

@tools_bp.get('')

def get_tools():
    db = get_db()
    tools = get_all_tools(db)
    return jsonify([serialize_tool(tool) for tool in tools])

@tools_bp.get('/<name>')
def get_tool(name: str):
    db = get_db()
    tool = get_tool_by_name(db, name)
    if tool is None:
        abort(404, description=f"No tool found with name '{name}'")
    return jsonify(serialize_tool(tool))