// AdminDashboard — the main admin panel, only reachable via ProtectedRoute.
// Fetches the project list and provides entry points for editing.
// Extend this with your specific admin controls as needed.
 
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { getProjects } from "../api/projects";
import type { ProjectBrief } from "../types/project.types";
import "./AdminDashboard.css";
 
export default function AdminDashboard() {
  const { logout } = useAuth();
  const [projects, setProjects] = useState<ProjectBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
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
                  <button
                    className="admin-action-btn"
                    onClick={() =>
                      alert(`Edit "${project.name}" functionality not implemented yet`)
                    }
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
 
        {!loading && !error && projects.length === 0 && (
          <p className="admin-status">No projects found.</p>
        )}
      </section>
    </div>
  );
}
 