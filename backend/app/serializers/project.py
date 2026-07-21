
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


def serialize_project_detail(project_row, descriptions, languages, categories, images, type_value):
    project = dict(project_row)
    project["descriptions"] = descriptions
    project["languages"] = languages
    project["categories"] = categories
    project["images"] = images
    project["type"] = type_value
    project["thumbnail"] = {
        "url": project.pop("thumbnail_image"),
        "alt_text": f"{project['name']} thumbnail",
    }
    return project
