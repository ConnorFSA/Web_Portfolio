import TitleBanner from '../components/generic/TitleBanner.tsx';
import ProjectCard from '../components/projects/ProjectCard.tsx';
import { useProjectBrief } from '../hooks/useProjectBrief.ts';
import './PageLayout.css';
import '../components/projects/ProjectList.css';
import NameTag from '../components/generic/NameTag.tsx';


export default function Home() {
  const featureProject1 = useProjectBrief('web-portfolio');
  const featureProject2 = useProjectBrief('project-beta');
  const featureProject3 = useProjectBrief('project-gamma');

  const tools: string[] = ['VSCode', 'Git'];
  const languages: string[] = ['Python', 'JavaScript', 'OpenJDK', 'Typescript'];
  const frameworks: string[] = ['React', 'Flask'];
  const otherSkills: string[] = ['SQLite', 'Linux', 'Jira', 'UnrealEngine', 'Unity'];

  return (
    <div className="page">

      <div className='content'>
        <TitleBanner
          title='Connors Work Portfolio'
          subtitle='Welcome to my portfolio'
          description='A curated collection of the projects I have built across web development, 
          graphics programming, and software engineering. I am a developer with a passion for building things from the ground up, 
          whether that is a full-stack web application, a custom rendering engine, or the infrastructure that keeps it all running. 
          This site is built with React, TypeScript, Flask, and SQLite, and is continuously updated with new projects, content, and improvements to the site itself.'
          imageUrl='https://picsum.photos/300/300' />
      </div>

      <div className="content">
        <TitleBanner
          title='Personal Summary'
          description='I am a software developer with a Bachelor of Information Technology from the University of South Australia, 
          specialising in Games and Entertainment Design. My experience spans a range of programming languages, project types, 
          and the full development lifecycle, from writing application logic to configuring the infrastructure that serves it in production. 
          I am driven by a genuine curiosity for how things work under the hood, 
          and I take pride in building projects from the ground up with a focus on quality, 
          maintainability, and continuous improvement.'
          imageUrl='https://picsum.photos/300/300'
          imagePosition='left'
          imageAlt='' />
      </div>


      <div className="content">
        <TitleBanner title='Featured Projects' />

        <div className='project-grid'>
          {featureProject1.project && <ProjectCard project={featureProject1.project} />}
          {featureProject2.project && <ProjectCard project={featureProject2.project} />}
          {featureProject3.project && <ProjectCard project={featureProject3.project} />}
        </div>
      </div>


      <div className="content">
        <TitleBanner title='Tech Stack / Skills' />
        <div className='skill-card'>
          <div className='skill-section'>
            <h3 className='skill-heading'>Tools</h3>
            <div className='skill-tags'>
              {tools.map((tool, index) => (
                <NameTag key={index} tag={tool} svgIcon={'https://cdn.simpleicons.org/' + tool} />
              ))}
            </div>
          </div>
          <div className='skill-section'>
            <h3 className='skill-heading'>Languages</h3>
            <div className='skill-tags'>
              {languages.map((language, index) => (
                <NameTag key={index} tag={language} svgIcon={'https://cdn.simpleicons.org/' + language} />
              ))}
            </div>
          </div>
          <div className='skill-section'>
            <h3 className='skill-heading'>Frameworks</h3>
            <div className='skill-tags'>
              {frameworks.map((framework, index) => (
                <NameTag key={index} tag={framework} svgIcon={'https://cdn.simpleicons.org/' + framework} />
              ))}
            </div>
          </div>
          <div className='skill-section'>
            <h3 className='skill-heading'>Other Skills</h3>
            <div className='skill-tags'>
              {otherSkills.map((other, index) => (
                <NameTag key={index} tag={other} svgIcon={'https://cdn.simpleicons.org/' + other} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="content">
        <TitleBanner title='Contacts and Socials' />
        <div className='skill-card'>
          <div
            className='social-links'
            onClick={() => window.open('mailto:connor.d.freebairn04@gmail.com')}
          >
            <NameTag tag='Email: connor.d.freebairn04@gmail.com' svgIcon='https://cdn.simpleicons.org/gmail' />
          </div>

          <div
            className='social-links'
            onClick={() => window.open('https://www.linkedin.com/in/connor-freebairn/')}
          >
            <NameTag tag='LinkedIn: Connor Freebairn' />
          </div>

          <div
            className='social-links'
            onClick={() => window.open('https://github.com/ConnorFSA')}
          >
            <NameTag tag='GitHub: ConnorFSA' svgIcon='https://cdn.simpleicons.org/github/grey' />
          </div>
        </div>
      </div>

    </div>
  );
}