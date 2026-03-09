import {useState, useEffect} from "react";

interface Project {
    id: number;
    thumbnail: string;
    name: string;
    type: string;
    summary: string;
    categories: string[];
    languages: string[];
    date: Date;
}

function ProjectList() {
    // The project data is stored in the satate variable projectData
    // setProjectData is a function that updates the projectData variable and re-renders the component
    const [projectData, setProjectData ] = useState<Project[]>([]);

    const fetchProjects = async () => {
        const response = await fetch("/api/projects");
        const data: Project[] = await response.json();
        setProjectData(data);
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    return (
        <div>
            {projectData.map((project) => {
                return (
                    <li key={project.id}> 
                    {project.name}, {project.type}
                    </li>
                );
            })}
        </div>
    );
}

export default ProjectList;