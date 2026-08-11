def serialize_tool(tool_row):
    tool = dict(tool_row)
    tool["id"] = tool.pop("pk_tool")
    tool["image_url"] = tool.pop("image_icon")
    return tool