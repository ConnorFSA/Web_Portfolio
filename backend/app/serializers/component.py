import json


def serialize_component_row(row):
    component = dict(row)
    component["id"] = component.pop("pk_component")
    component["config"] = json.loads(component["config"])
    return component


def serialize_component_text(component_row):
    component = serialize_component_row(component_row)
    return {
        "id": component["id"],
        "type": component["type"],
        "position": component["position"],
        "config": component["config"],
    }


def serialize_component_images(component_row, images):
    component = serialize_component_row(component_row)
    config = component["config"].copy()
    config["images"] = images
    return {
        "id": component["id"],
        "type": component["type"],
        "position": component["position"],
        "config": config,
    }
