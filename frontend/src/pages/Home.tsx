import TitleBanner from '../components/generic/TitleBanner.tsx';
import ProjectCard from '../components/projects/ProjectCard.tsx';
import { useProjectBrief } from '../hooks/useProjectBrief.ts';
import './PageLayout.css';
import '../components/projects/ProjectList.css';
import NameTag from '../components/generic/NameTag.tsx';


export default function Home() {
  const featureProject1 = useProjectBrief('project-alpha');
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
          subtitle='Welcome to my website'
          description='Built using React, Typescript, Python, Flask and SQLite. 
          This portfolio showcases a selection of my projects, highlighting my skills and experience in sotware development.
          This website is will be regularly updated not only with new projects and content, but also with improvements to the design and functionality.
          Feel free to explore and check back more often to see the latest updates and additions.'
          imageUrl='https://picsum.photos/300/300' />
      </div>

      <div className="content">
        <TitleBanner
          title='Personal Summary'
          description='I am a software developer with a Bachelor of Information Technology from the University of South Australia,
           specialising in Games and entertainment design. I have experience in a range of programming Languages and project types.
           I am passionate about my work and am always looking for new opportunities to learn and grow as a developer,
           traits accentuated by my work ethic and dedication to learning.
           '
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