from app.data_access.tool import (
    get_tools,
    get_tool_by_name,
)
from app.serializers.tool import serialize_tool

def get_all_tools(db):
    return get_tools(db)

def get_tool_by_name(db, name):
    tool = get_tool_by_name(db, name)
    return serialize_tool(tool)