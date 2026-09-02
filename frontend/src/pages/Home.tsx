import TitleBanner from '../components/generic/TitleBanner.tsx';
import ProjectCard from '../components/projects/ProjectCard.tsx';
import { useProjectBrief } from '../hooks/useProjectBrief.ts';
import './PageLayout.css';
import '../components/projects/ProjectList.css';
import NameTag from '../components/generic/NameTag.tsx';
import { useLanguages } from '../hooks/useLanguages.ts';
import { useTools } from '../hooks/useTools.ts';

export default function Home() {
  const featureProject1 = useProjectBrief('web-portfolio');
  const featureProject2 = useProjectBrief('java-2d-renderer');
  const featureProject3 = useProjectBrief('vr-aviation-learning-tool');

  const languageList = useLanguages();
  const toolList = useTools();

  return (
    <div className="page page--home">
      <div className="content-spacing content-spacing--hero">
        <TitleBanner
          title="Connor Freebairn"
          subtitle="Software developer building thoughtful digital products."
          description="I design and build practical software across web applications, graphics systems, and interactive experiences. My work combines product thinking, engineering discipline, and a strong focus on usability, maintainability, and clear execution."
        />
      </div>

      <div className="content-spacing">
        <section className="section-panel">
          <div className="section-heading">
            <p className="eyebrow">Overview</p>
            <h2>Product-minded engineering with a hands-on approach.</h2>
          </div>

          <div className="story-grid">
            <p>
              I am a software developer with a Bachelor of Information Technology from the
              University of South Australia, specialising in Games and Entertainment Design.
              My work spans frontend systems, backend services, and interactive technical projects,
              with a consistent focus on building software that is both useful and maintainable.
            </p>
            <p>
              I enjoy working across the full lifecycle of a project, from shaping the problem and
              prototyping the idea through to implementation, iteration, and deployment. I value
              clean architecture, accessible design, and solutions that are grounded in real user
              needs rather than complexity for its own sake.
            </p>
          </div>
        </section>
      </div>

      <div className="content-spacing">
        <section className="section-panel">
          <div className="section-heading">
            <p className="eyebrow">Selected work</p>
            <h2>Recent projects</h2>
          </div>

          <div className="feature-grid">
            {featureProject1.project && <ProjectCard project={featureProject1.project} />}
            {featureProject2.project && <ProjectCard project={featureProject2.project} />}
            {featureProject3.project && <ProjectCard project={featureProject3.project} />}
          </div>
        </section>
      </div>

      <div className="content-spacing">
        <section className="section-panel">
          <div className="section-heading">
            <p className="eyebrow">Capabilities</p>
            <h2>Tools, technologies, and ways of working.</h2>
          </div>

          <div className="skill-card">
            <div className="skill-section">
              <h3 className="skill-heading">Languages & frameworks</h3>
              {(() => {
                if (languageList.loading) {
                  return <p>Loading</p>;
                }
                if (languageList.error) {
                  return <p>Error: {languageList.error.message}</p>;
                }
                if (!languageList.languages) {
                  return <p>No languages found</p>;
                }
                return (
                  <div className="skill-tags">
                    {languageList.languages.map((lang, index) => (
                      <NameTag key={index} tag={lang.language} svgIcon={lang.image_url} />
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="skill-section">
              <h3 className="skill-heading">Tools & services</h3>
              {(() => {
                if (toolList.loading) {
                  return <p>Loading</p>;
                }
                if (toolList.error) {
                  return <p>Error: {toolList.error.message}</p>;
                }
                if (!toolList.tools) {
                  return <p>No tools found</p>;
                }
                return (
                  <div className="skill-tags">
                    {toolList.tools.map((tool, index) => (
                      <NameTag key={index} tag={tool.tool} svgIcon={tool.image_url} />
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </section>
      </div>

      <div className="content-spacing">
        <section className="cta-panel">
          <h3>Let's connect.</h3>
          <p>
            I am interested in meaningful product work, technical problem-solving, and building
            software that follows best practices while remaining practical and usable. If you have a project or opportunity
            that aligns with my skills and interests, I would love to hear from you.
          </p>
          <div className="button-row">
            <a className="cta-button cta-button--primary" href="https://www.linkedin.com/in/connor-freebairn/" target="_blank" rel="noreferrer">
              Connect on LinkedIn
            </a>
            <a className="cta-button" href="/about">
              More about me
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}