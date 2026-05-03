import ProjectList from '../components/projects/ProjectList';
import TitleBanner from '../components/generic/TitleBanner.tsx';

export default function Projects() {
  return (
    <div>
      <TitleBanner
        title='Projects'
      />
      <ProjectList />
    </div>
  );
}