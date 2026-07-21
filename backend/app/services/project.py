from app.data_access.project import (
    get_categories_for_project,
    get_descriptions_for_project,
    get_images_for_project,
    get_languages_for_project,
    get_project_by_slug_raw,
    get_project_brief_by_slug_raw,
    get_projects_raw,
    get_type_for_project,
)
from app.serializers.project import (
    serialize_project_card,
    serialize_project_detail,
)


def get_all_projects(db):
    rows = get_projects_raw(db)
    projects = []
    for row in rows:
        project_id = row["pk_project"]
        projects.append(
            serialize_project_card(
                row,
                get_languages_for_project(db, project_id),
                get_categories_for_project(db, project_id),
                get_type_for_project(db, project_id),
            )
        )
    return projects


def get_project_by_slug(db, slug):
    row = get_project_by_slug_raw(db, slug)
    if row is None:
        return None
    project_id = row["pk_project"]
    return serialize_project_detail(
        row,
        get_descriptions_for_project(db, project_id),
        get_languages_for_project(db, project_id),
        get_categories_for_project(db, project_id),
        get_images_for_project(db, project_id),
        get_type_for_project(db, project_id),
    )


def get_project_brief_by_slug(db, slug):
    row = get_project_brief_by_slug_raw(db, slug)
    if row is None:
        return None
    project_id = row["pk_project"]
    return serialize_project_card(
        row,
        get_languages_for_project(db, project_id),
        get_categories_for_project(db, project_id),
        get_type_for_project(db, project_id),
    )
