-- Adds the components table for flexible per-project page blocks.
CREATE TABLE IF NOT EXISTS components (
  pk_component INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  position INTEGER NOT NULL,
  type TEXT NOT NULL,
  config TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (project_id) REFERENCES projects(pk_project)
);
