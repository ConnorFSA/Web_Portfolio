-- LANGUAGES (with SVG icons)
INSERT INTO languages (language, image_icon) VALUES
('JavaScript', 'https://cdn.simpleicons.org/javascript'),
('Python', 'https://cdn.simpleicons.org/python'),
('Java', 'https://cdn.simpleicons.org/openjdk'),
('TypeScript', 'https://cdn.simpleicons.org/typescript'),
('SQL', 'https://cdn.simpleicons.org/mysql');

-- CATEGORIES
INSERT INTO categories (category) VALUES
('Personal'),
('University'),
('Work');

-- TYPES
INSERT INTO types (type) VALUES
('Web App'),
('CLI Tool'),
('Game'),
('API');

-- PROJECTS
INSERT INTO projects (name, slug, summary, start_date, end_date, thumbnail_image, url) VALUES
('Project Alpha', 'project-alpha', 'Basic test project for development purposes.', '2024-01-01', '2024-02-01', 'https://picsum.photos/seed/alpha/400/300', 'https://example.com/alpha'),
('Project Beta', 'project-beta', 'Another placeholder project for testing.', '2024-03-01', '2024-04-01', 'https://picsum.photos/seed/beta/400/300', 'https://example.com/beta'),
('Project Gamma', 'project-gamma', 'Development-only project entry.', '2024-05-01', NULL, 'https://picsum.photos/seed/gamma/400/300', 'https://example.com/gamma'),
('Project Delta', 'project-delta', 'Sample project used for database seeding.', '2024-06-01', NULL, 'https://picsum.photos/seed/delta/400/300', 'https://example.com/delta');

-- PROJECT DESCRIPTIONS
INSERT INTO project_descriptions (fk_project, description) VALUES
(1, 'Development-only description: This is a placeholder project used for testing database relationships.'),
(2, 'Development-only description: Used to validate UI rendering and API integration.'),
(3, 'Development-only description: Simulates an in-progress project entry.'),
(4, 'Development-only description: General test data for production seeding.');

-- PROJECT IMAGES
INSERT INTO images (fk_project, image, alt_text) VALUES
(1, 'https://picsum.photos/seed/alpha1/800/600', 'Development image 1 for Project Alpha'),
(1, 'https://picsum.photos/seed/alpha2/800/600', 'Development image 2 for Project Alpha'),

(2, 'https://picsum.photos/seed/beta1/800/600', 'Development image 1 for Project Beta'),

(3, 'https://picsum.photos/seed/gamma1/800/600', 'Development image 1 for Project Gamma'),

(4, 'https://picsum.photos/seed/delta1/800/600', 'Development image 1 for Project Delta');

-- PROJECT LANGUAGES
INSERT INTO project_languages (fk_project, fk_language) VALUES
(1, 1), -- JavaScript
(1, 4), -- TypeScript

(2, 2), -- Python
(2, 5), -- SQL

(3, 3), -- Java

(4, 1), -- JavaScript
(4, 5); -- SQL

-- PROJECT CATEGORIES
INSERT INTO project_categories (fk_project, fk_category) VALUES
(1, 1), -- Personal
(2, 2), -- University
(3, 2), -- University
(4, 3); -- Work

-- PROJECT TYPES
INSERT INTO project_types (fk_project, fk_type) VALUES
(1, 1), -- Web App
(2, 4), -- API
(3, 3), -- Game
(4, 2); -- CLI Tool