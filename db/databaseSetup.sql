CREATE TABLE IF NOT EXISTS projects (
  pk_project   INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT NOT NULL,
  start_date   DATE,
  thumbnail_image TEXT
);

CREATE TABLE IF NOT EXISTS categories (
  pk_category  INTEGER PRIMARY KEY AUTOINCREMENT,
  category     TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS project_categories (
  fk_project   INTEGER NOT NULL,
  fk_category  INTEGER NOT NULL,
  PRIMARY KEY (fk_project, fk_category),
  FOREIGN KEY (fk_project) REFERENCES projects(pk_project),
  FOREIGN KEY (fk_category) REFERENCES categories(pk_category)
);

CREATE TABLE IF NOT EXISTS languages (
  pk_language  INTEGER PRIMARY KEY AUTOINCREMENT,
  language     TEXT NOT NULL,
  image_icon   TEXT
);

CREATE TABLE IF NOT EXISTS project_languages (
  fk_project   INTEGER NOT NULL,
  fk_language  INTEGER NOT NULL,
  PRIMARY KEY (fk_project, fk_language),
  FOREIGN KEY (fk_project) REFERENCES projects(pk_project),
  FOREIGN KEY (fk_language) REFERENCES languages(pk_language)
);

CREATE TABLE IF NOT EXISTS images (
  pk_image     INTEGER PRIMARY KEY AUTOINCREMENT,
  fk_project   INTEGER NOT NULL,
  image        TEXT,
  alt_text     TEXT,
  FOREIGN KEY (fk_project) REFERENCES projects(pk_project)
);

CREATE TABLE IF NOT EXISTS project_summaries (
  pk_project_summary INTEGER PRIMARY KEY AUTOINCREMENT,
  fk_project         INTEGER NOT NULL,
  summary            TEXT,
  FOREIGN KEY (fk_project) REFERENCES projects(pk_project)
);

CREATE TABLE IF NOT EXISTS project_descriptions (
  pk_project_description INTEGER PRIMARY KEY AUTOINCREMENT,
  fk_project             INTEGER NOT NULL,
  description            TEXT,
  FOREIGN KEY (fk_project) REFERENCES projects(pk_project)
);