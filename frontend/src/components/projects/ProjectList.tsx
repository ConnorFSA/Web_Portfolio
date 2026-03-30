import { useState, useEffect } from "react";
import { useProjects } from "../../hooks/useProjects.ts";
import type * as ProjectTypes from '../../types/project.types';

function ProjectList() {
  const {projects, loading, error} = useProjects();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error... {error.message}</p>;

  return (
    <div>
      {projects.map((project) => (
        <div key={project.id}>
          <img src={project.thumbnail.url} alt={project.thumbnail.alt_text} />
          <h2>{project.name}</h2>
          <p>{project.summary}</p>
          <p>Categories: {project.categories.map(c => c.category).join(', ')}</p>
          <p>
            Languages:{' '}
            {project.languages.map((l, i) => (
              <span key={i} style={{ marginRight: '12px' }}>
                <img 
                  src={l.image_url} 
                  alt={l.language}
                  style={{ width: '20px', height: '20px', marginRight: '4px', verticalAlign: 'middle' }}
                />
                {l.language}
              </span>
            ))}
          </p>
          <p>Date: {project.end_date}</p>
        </div>
      ))}
    </div>
  );
}

export default ProjectList;