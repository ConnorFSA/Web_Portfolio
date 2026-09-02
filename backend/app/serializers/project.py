
# Serializers convert the database rows into the consistent payloads expected by the
# frontend, keeping the API contract separate from the satabase model.
def serialize_project_card(project_row, languages, categories, type_value):
    project = dict(project_row)
    project["id"] = project.pop("pk_project")
    project["thumbnail"] = {
        "url": project.pop("thumbnail_image"),
        "alt_text": f"{project['name']} thumbnail",
    }
    project["languages"] = languages
    project["categories"] = categories
    project["type"] = {"type": type_value} if type_value else None
    return project


def serialize_project_detail(project_row, blocks, languages, categories, images, type_value, tools=None, type_ids=None):
    project = dict(project_row)
    project["id"] = project.pop("pk_project")
    project["blocks"] = blocks
    project["languages"] = languages
    project["categories"] = categories
    project["images"] = images
    project["type"] = type_value
    project["tools"] = tools or []
    project["type_ids"] = type_ids or []
    project["thumbnail"] = {
        "url": project.pop("thumbnail_image"),
        "alt_text": f"{project['name']} thumbnail",
    }
    return project
