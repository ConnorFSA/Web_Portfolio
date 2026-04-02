import { useProjects } from "../../hooks/useProjects.ts";
import ProjectCard from "./ProjectCard.tsx";
import "./ProjectList.css";

function ProjectList() {
  const {projects, loading, error} = useProjects();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error... {error.message}</p>;
  if (!projects) return <p>Project not found</p>;

  return (
    <div className="project-grid">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

export default ProjectList;