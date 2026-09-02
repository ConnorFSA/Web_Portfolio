// AdminDashboard — the main admin panel, only reachable via ProtectedRoute.
// Fetches the project list and provides entry points for editing.
// Extend this with your specific admin controls as needed.
 
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { getProjects } from "../api/projects";
import type { ProjectBrief } from "../types/project.types";
import "./AdminDashboard.css";
import { NavLink } from "react-router-dom";
import PopupMenu from "../components/generic/PopupMenu";
import ProjectMetadataEditor from "../components/admin/ProjectMetadataEditor";
import { getProjectOptions } from "../api/admin";
import type { ProjectOptions } from "../api/admin";
 
export default function AdminDashboard() {
  // This page acts as the main administrative landing screen and centralises access
  // to project management actions and user sign-out.
  const { logout } = useAuth();
  const [projects, setProjects] = useState<ProjectBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [options, setOptions] = useState<ProjectOptions | null>(null);
 
  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
 
  async function handleLogout() {
    await logout();
    // AuthContext sets isAdmin=false → ProtectedRoute redirects to /admin/login
  }

  async function openCreateProject() {
    // The creation form depends on the catalog metadata, so the options are loaded
    // once and cached before the popup is opened.
    setError(null);
    try {
      setOptions(options ?? await getProjectOptions());
      setIsCreateOpen(true);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load project options");
    }
  }
 
  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1 className="admin-title">Admin dashboard</h1>
        <button className="admin-logout" onClick={handleLogout}>
          Sign out
        </button>
      </header>
 
      <section className="admin-section">
        <h2 className="admin-section-title">Projects</h2>
        <button className="admin-action-btn" type="button" onClick={openCreateProject}>Create project</button>
 
        {loading && <p className="admin-status">Loading projects...</p>}
        {error && <p className="admin-status admin-status--error">{error}</p>}
 
        {!loading && !error && (
          <ul className="admin-project-list">
            {projects.map((project) => (
              <li key={project.slug} className="admin-project-item">
                <div className="admin-project-info">
                  <span className="admin-project-name">{project.name}</span>
                  <span className="admin-project-slug">{project.slug}</span>
                </div>
                <div className="admin-project-actions">
                  {/* TODO wire up edit functionality */}
                  <NavLink
                    to={`/admin/projects/${project.slug}/edit`}
                    className="admin-action-btn"
                  >
                    Edit
                  </NavLink>
                </div>
              </li>
            ))}
          </ul>
        )}
 
        {!loading && !error && projects.length === 0 && (
          <p className="admin-status">No projects found.</p>
        )}
      </section>

      <PopupMenu isOpen={isCreateOpen && options !== null} title="Create project" onClose={() => setIsCreateOpen(false)}>
        {options && <ProjectMetadataEditor options={options} onSaved={() => window.location.reload()} onClose={() => setIsCreateOpen(false)} />}
      </PopupMenu>
    </div>
  );
}
 