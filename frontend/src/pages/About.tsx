import NameTag from '../components/generic/NameTag.tsx';
import TitleBanner from '../components/generic/TitleBanner.tsx';
import './PageLayout.css';

export default function About() {
  return (
    <div className="page">
      <div className="content">
        <TitleBanner
          title='About Me'
          subtitle='Learn more about my background and experience'
          imageUrl='static/media/about/STEM_Event-305.JPG'
        />
      </div>
      <div className="content">
        <TitleBanner
          title='Professional Bio'
          subtitle='A brief overview of my professional background'
          description='I am a software developer with a Bachelor of Information Technology 
          from the University of South Australia, specialising in Games and Entertainment 
          Design. My experience spans a range of programming languages and project types, 
          working both independently and collaboratively as a team member and technical lead.
          '
        />
      </div>
      <div className="content">
        <div className='card'>
          <p className='description'>
            I have developed software across a broad range of project types — from CLI
            applications and web platforms to virtual reality experiences — delivered for
            clients, as part of my studies, and as personal projects. Notable works include
            a virtual reality experience developed for a client's PhD thesis, a 3D game built
            in Unreal Engine, and a 2D graphics engine demonstrated through a playable Snake
            game. These projects and more are showcased throughout this portfolio. During my
            degree, the VR experience developed for our client was entered into the 2025 STEM
            Expo, where the project was awarded Best Undergraduate IT Project.
          </p>
        </div>
      </div>

      <div className="content">
        <TitleBanner
          title='Skills'
          subtitle='Technologies and tools I specialize in'
          description='My technical skills span web development, game development, and 
          systems programming, developed across university projects, personal work, and 
          four years in a professional environment. Visit the Projects section to see 
          these technologies applied in context.'
        />
      </div>
      <div className="content">
        <TitleBanner
          title='Experience'
          subtitle='My professional and academic background'
        />
      </div>

      <div className="content">
        <div className='card'>
          <p className='description'>Administrative Service Officer — Patient Services</p>
          <p className='description'>Feb 2022 - Present</p>

          <p className='description'>
            Provided administrative support across multiple hospital departments including
            Patient Services, Medical Records, Day Surgery, and Mental Health. Responsibilities
            included managing sensitive documentation, patient bookings, and inter-department
            information flow in compliance with privacy requirements. Identified and resolved
            hardware, software, and workflow issues in collaboration with management, improving
            day-to-day operational efficiency. Selected to cover Day Surgery operations during
            staff leave, overseeing daily workflows and training incoming staff.
          </p>
          <p></p>
          <p className='description'>Administrative Service Officer — Ward Clerk</p>
          <p className='description'>Sep 2022 - Dec 2022</p>

          <p className='description'>
            Provided time-critical administrative support in a clinical ward environment.
            Reduced errors in death certificate documentation by authoring procedural packs
            for clinical staff, later adopted by a neighbouring hospital. Developed a
            comprehensive digital procedure guide for the role, still maintained by current staff.
          </p>
        </div>
      </div>

      <div className="content">
        <TitleBanner
          title='Achievements'
          subtitle='Highlights from my academic and professional journey'
        />
      </div>

      <div className="content">
        <div className='card'>
          <p className='description'>2025 - Awarded Best Undergraduate ICT Capstone Project, Enterprising STEM Expo</p>
          <p className='description'>2024 - Nominated by the University of South Australia for the Golden Key International Honour Society, ranking in the top 15% of field</p>
          <p className='description'>2026 - White Ribbon Accreditation</p>
          <p className='description'>2018 - Venturer Scouts leadership and unit management training</p>
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