import argparse
import urllib.error
import urllib.request
from pathlib import Path

from scripts.database.add_language import add_languages

# for imports to work needs to be run from the root directory
# tun command: python -m scripts.assets.fetch_and_build_languages
# --text to input a single string --file to specify a file of image slugs and names
# to define a icon specify the name then the smple icons slug separated by a comma with more the next icon entered on the next line.
# {name},{slug}

# config 
ICON_DIR = Path(__file__).parent.parent.parent / "backend/app/static/media/icons/svg/languages"
ICON_DIR.mkdir(parents=True, exist_ok=True)
ICON_LINK_TEMPLATE = "/static/media/icons/svg/languages"

ICON_URL = "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/{slug}.svg"

# icon downlaoder, takes a slug and return the local file path or None if not found
def download_icon(slug: str) -> str | None:
    slug = slug.lower().strip()
    url = ICON_URL.format(slug=slug)

    try:
        with urllib.request.urlopen(url) as response:
            if response.status != 200:
                return None
            content = response.read()
    except urllib.error.URLError:
        return None

    file_path = ICON_DIR / f"{slug}.svg"
    file_path.write_bytes(content)

    return str(ICON_LINK_TEMPLATE + f"/{slug}.svg")

# passed a list of lines, returns a dict with name as key and the icon path as a value
def parse_input_lines(lines):
    """
    Expected format:
        name,slug
    """
    result = {}

    for line in lines:
        line = line.strip()

        if not line or line.startswith("#"):
            continue

        try:
            name, slug = [x.strip() for x in line.split(",", 1)]
        except ValueError:
            print(f"Skipping invalid line: {line}")
            continue

        icon_path = download_icon(slug)

        # allow missing icons
        if icon_path is None:
            icon_path = ""

        result[name] = icon_path

    return result

def load_from_file(file_path: str):
    with open(file_path, "r", encoding="utf-8") as f:
        return parse_input_lines(f.readlines())


def load_from_text(text: str):
    lines = text.split("\n")
    return parse_input_lines(lines)

def main():

    parser = argparse.ArgumentParser()

    parser.add_argument("--file", help="Path to input file")
    parser.add_argument("--text", help="Raw text input (name,slug per line)")

    args = parser.parse_args()

    if not args.file and not args.text:
        parser.error("Provide either --file or --text")

    if args.file:
        data = load_from_file(args.file)
    else:
        data = load_from_text(args.text)

    result = add_languages(data)

    print("\n=== RESULT ===")
    print(result)


if __name__ == "__main__":
    main()