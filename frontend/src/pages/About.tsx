import NameTag from '../components/generic/NameTag.tsx';
import TitleBanner from '../components/generic/TitleBanner.tsx';
import './PageLayout.css';

const experienceHistory = [
  {
    role: 'Administrative Service Officer — Patient Services',
    period: 'Feb 2022 — Present',
    description:
      'Support multiple hospital departments with sensitive patient administration, bookings, and documentation workflows. This role strengthened my ability to work under pressure, manage operational detail, and keep information flow accurate in time-sensitive environments.',
  },
  {
    role: 'Administrative Service Officer — Ward Clerk',
    period: 'Sep 2022 — Dec 2022',
    description:
      'Delivered high-priority administrative support in a clinical ward environment and improved documentation procedures by creating clearer operational guidance that reduced avoidable errors and improved team consistency.',
  },
];

const achievements = [
  '2025 — Awarded Best Undergraduate ICT Capstone Project at the Enterprise STEM Expo.',
  '2024 — Nominated by the University of South Australia for Golden Key, placing in the top 15% of the field.',
  '2026 — White Ribbon Accreditation.',
  '2018 — Venturer Scouts leadership and unit management training.',
];

export default function About() {
  return (
    <div className="page page--about">
      <div className="content-spacing content-spacing--hero">
        <TitleBanner
          title="About me"
          subtitle="I build software with a practical, product-focused mindset."
          imageUrl="static/media/about/STEM_Event-305.JPG"
          imageAlt="Connor at a STEM event"
        />
      </div>

      <div className="content-spacing">
        <section className="section-panel">
          <div className="section-heading">
            <p className="eyebrow">Professional profile</p>
            <h2>Solving problems with clear, maintainable systems</h2>
          </div>

          <div className="bio-grid">
            <p>
              I am a software developer with a Bachelor of Information Technology from the
              University of South Australia, specialising in Games and Entertainment Design.
              My work spans frontend engineering, backend systems, graphics programming, and
              interactive product development, with a consistent emphasis on clean user-focused design.
            </p>
            <p>
              Throughout my studies and professional work, I have developed systems for clients,
              coursework, and personal projects, including web platforms, virtual reality
              experiences, and game-focused technical demonstrations. I value clean architecture,
              thoughtful user experience, and software that is maintainable as it evolves over time.
            </p>
          </div>
        </section>
      </div>

      <div className="content-spacing">
        <section className="section-panel">
          <div className="section-heading">
            <p className="eyebrow">Experience</p>
            <h2>Professional and academic background.</h2>
          </div>

          <div className="timeline-list">
            {experienceHistory.map((item) => (
              <article key={item.role} className="timeline-item">
                <div className="timeline-item__meta">
                  <p className="timeline-item__role">{item.role}</p>
                  <p className="timeline-item__period">{item.period}</p>
                </div>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="content-spacing">
        <section className="section-panel">
          <div className="section-heading">
            <p className="eyebrow">Skills</p>
            <h2>Technical strengths across software, design, and systems.</h2>
          </div>

          <div className="info-grid">
            <div className="info-panel">
              <p>
                My work spans web development, systems thinking, graphics programming, and the
                design of interfaces that balance usability with technical effectiveness. I have
                built projects using multiple languages and frameworks, and I enjoy translating
                user needs into clear product decisions and reliable outcomes.
              </p>
            </div>
            <div className="info-panel">
              <p>
                I am particularly interested in projects that combine technical problem-solving with
                a user-focused approach, and enjoy working across the full lifecycle of a project,
                from shaping the problem and prototyping ideas through to implementation,
                iteration, and deployment.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="content-spacing">
        <section className="section-panel">
          <div className="section-heading">
            <p className="eyebrow">Achievements</p>
            <h2>Highlights from my journey.</h2>
          </div>

          <div className="timeline-list">
            {achievements.map((achievement) => (
              <article key={achievement} className="timeline-item">
                <p>{achievement}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="content-spacing">
        <section className="section-panel">
          <div className="section-heading">
            <p className="eyebrow">Contact</p>
            <h2>Connect with me.</h2>
          </div>

          <div className="contact-grid">
            <div
              className="social-links"
              onClick={() => window.open('https://www.linkedin.com/in/connor-freebairn/')}
            >
              <NameTag tag='LinkedIn: Connor Freebairn' />
            </div>

            <div
              className="social-links"
              onClick={() => window.open('https://github.com/ConnorFSA')}
            >
              <NameTag tag='GitHub: ConnorFSA' svgIcon='https://cdn.simpleicons.org/github/grey' />
            </div>

            <div
              className="social-links"
              onClick={() => window.open('https://gitlab.com/frecd002/')}
            >
              <NameTag tag='GitLab: frecd002' svgIcon='https://cdn.simpleicons.org/gitlab/grey' />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}