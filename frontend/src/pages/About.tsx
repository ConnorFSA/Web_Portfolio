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
          imageUrl='https://picsum.photos/300/300'
        />
      </div>
      <div className="content">
        <TitleBanner
          title='Professional Bio'
          subtitle='A brief overview of my professional background'
          description='I am a software developer with a Bachelor of Information Technology from the University of South Australia,
          specialising in Games and entertainment design.
          I have experience in a range of programming Languages and project types,
          working alone and in a team as both a leader and team member.
          I have a strong work ethic and am passionate about my work, always striving for the best solution to every problem I encounter.
          '
        />
      </div>
      <div className="content">
        <div className='card'>
          <p className='description'>I have developed a range of software projects from minor CLI applications to virtual reality experiences, 
            each for clients, study and personal projects. Some of my most notable projects include a virtual reality eaxperience
            for the client's PHD thesis, a 3D game developed in Unreal Engine, and a Snake game developed using low level
            rendering techniques. All of these projects and more are showcased in the Projects section of this website.
            As part of my degree, when developing the VR expereience for our client the project was entered into the 2025 STEM Expo,
            where we won the best Undergraduate IT project.
          </p>
        </div>
      </div>

      <div className="content">
        <TitleBanner
          title='Skills'
          subtitle='Technologies and tools I specialize in'
          description='Check out the projects section for a better breakdown of my skills and tools I have used.
          A more comprehensive list will be added in the future.'
        />
      </div>
      <div className="content">
        <TitleBanner
          title='Work Experience'
          subtitle='My career journey and key accomplishments'
          description=''
        />
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