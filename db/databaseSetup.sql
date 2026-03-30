CREATE TABLE IF NOT EXISTS projects (
  pk_project INTEGER PRIMARY KEY AUTOINCREMENT,
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  summary         TEXT,
  start_date      TEXT NOT NULL,
  end_date        TEXT,
  thumbnail_image TEXT,
  url             TEXT
);

-- Table to store each unique language
CREATE TABLE IF NOT EXISTS languages (
  pk_language   INTEGER PRIMARY KEY AUTOINCREMENT,
  language      TEXT NOT NULL UNIQUE,
  image_icon    TEXT
);

-- Stores each languages used in each proeject
CREATE TABLE IF NOT EXISTS project_languages (
  fk_project     INTEGER NOT NULL,
  fk_language    INTEGER NOT NULL,
  PRIMARY KEY (fk_project, fk_language), -- composite key to prevent duplicates
  FOREIGN KEY (fk_project) REFERENCES projects(pk_project), 
  FOREIGN KEY (fk_language) REFERENCES languages(pk_language)
);

-- Table of broad categories work, school, personal ect
CREATE TABLE IF NOT EXISTS categories (
  pk_category   INTEGER PRIMARY KEY AUTOINCREMENT,
  category      TEXT NOT NULL UNIQUE
);

-- Stores each category for each project
CREATE TABLE IF NOT EXISTS project_categories (
  fk_project    INTEGER NOT NULL,
  fk_category   INTEGER NOT NULL,
  PRIMARY KEY (fk_project, fk_category),
  FOREIGN KEY (fk_project) REFERENCES projects(pk_project),
  FOREIGN KEY (fk_category) REFERENCES categories(pk_category)
);

-- Types that a project can reference multiple of, such as website webapp cli etc
CREATE TABLE IF NOT EXISTS types (
  pk_type INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL
);

-- Stores each type for each project
CREATE TABLE IF NOT EXISTS project_types (
  fk_project  INTEGER NOT NULL,
  fk_type    INTEGER NOT NULL,
  PRIMARY KEY (fk_project, fk_type),
  FOREIGN KEY (fk_project) REFERENCES projects(pk_project),
  FOREIGN KEY (fk_type) REFERENCES types(pk_type)
);

-- Stores images for each prject, including alt text
CREATE TABLE IF NOT EXISTS images (
  pk_image INTEGER PRIMARY KEY AUTOINCREMENT,
  fk_project INTEGER NOT NULL,
  image TEXT,
  alt_text TEXT,
  FOREIGN KEY (fk_project) REFERENCES projects(pk_project)
);

-- Stores descriptions for each project
CREATE TABLE IF NOT EXISTS project_descriptions (
  pk_project_description INTEGER PRIMARY KEY AUTOINCREMENT,
  fk_project INTEGER NOT NULL,
  description TEXT,
  FOREIGN KEY (fk_project) REFERENCES projects(pk_project)
);