import React from 'react';
import './BentoGrid.css';
import profilePic from '../../assets/images/pfp.webp';
import cv from '../../assets/documents/Luis Cedillo Maldonado CV.pdf';
import GitHubCalendar from 'react-github-calendar';
import { useTheme } from '../../contexts/ThemeContext';

// Font Awesome icons
import { 
  FaDownload, FaGithub, FaLinkedin, FaWhatsapp,
  FaInstagram, FaBriefcase, FaEnvelope, FaCalendarAlt,
  FaCrown, FaCircle, FaBullseye, FaSearch, FaFileAlt, FaFlask, FaRocket,
  FaHotel, FaMobile, FaRobot, FaUsers, FaTasks, FaUserTie, FaComments
} from 'react-icons/fa';

// Icons for programming languages and tools
import { 
  FaPython, FaCode, FaRust, FaTerminal,
  FaJs, FaReact, FaCss3, FaSwift,
  FaDatabase, FaServer, FaAws, FaDocker,
  FaLaptopCode
} from 'react-icons/fa';

import { FaRegClock, FaRegLightbulb, FaRegStar } from "react-icons/fa6";


// Additional icons
import { IoLocationSharp, IoPhonePortraitOutline } from "react-icons/io5";
import { IoMdSchool } from "react-icons/io";
import { TbWorld } from "react-icons/tb";
import { GoOrganization } from "react-icons/go";

const socialLinks = [
  {
    href: "https://github.com/luisced",
    icon: FaGithub,
    title: "Check out my GitHub",
    label: "@luisced"
  },
  {
    href: "https://linkedin.com/in/luisced",
    icon: FaLinkedin,
    title: "Connect with me on LinkedIn",
    label: "@luisced"
  },
  {
    href: "https://www.instagram.com/lui._.cedm",
    icon: FaInstagram,
    title: "Follow me on Instagram",
    label: "@lui._.cedm"
  }
];

const BentoGrid: React.FC = () => {
  const { theme } = useTheme();
  return (
    <div className="bento-grid">
      {/* Stat Cards - Row 1 */}
      <div className="card stat grid-years">
        <span className="big metal">04<span className="plus">+</span></span>
        <span className="label-badge"><FaRegClock /> YEARS EXPERIENCE</span>
      </div>
      <div className="card stat grid-projects">
        <span className="big metal">10<span className="plus">+</span></span>
        <span className="label-badge"><FaCode /> PROJECTS</span>
      </div>
      
      {/* GitHub Calendar Card - Row 1 */}
      <div className="card grid-github">
        <span className="corner-icon"><FaGithub /></span>
        <h2>
          <span className="metal">GitHub Contributions</span>
        </h2>
        <div className="github-calendar-container">
          <GitHubCalendar 
            username="luisced" 
            blockSize={12}
            blockMargin={4}
            fontSize={12}
            colorScheme={theme}
          />
        </div>
      </div>

      {/* Profile Card - Row 2 */}
      <div className="card grid-profile">
        <div className="profile-header">
          <img src={profilePic} alt="Luis Cedillo" />
          <div>
            <h2 style={{margin: "0 0 4px"}}>
              <span className="metal">LUIS CEDILLO M.</span>
            </h2>
            <div className="badge"><FaCircle className="badge-dot" /> Available to work</div>
          </div>
          
        </div>
        <p className="profile-bio">
          Backend developer & cloud engineer passionate about building scalable, maintainable solutions.
        </p>
        <div className="tags">
          <span className="tag"><IoLocationSharp /> Mexico</span>
          <span className="tag"><TbWorld /> English & Spanish</span>
          <span className="tag"><FaLaptopCode /> Software Engineer</span>
          <span className="tag"><FaRegClock /> CST -6</span>
          <span className="tag"><IoMdSchool /> Universidad Panamericana</span>
        </div>
        <div className="contact-buttons">
          <a className="button primary-button" href="https://wa.me/5571967146">
            <FaWhatsapp /> WhatsApp Me
          </a>
          <a className="button primary-button"  href={cv} download="Luis_Cedillo_Maldonado_CV.pdf">
            Resume <FaDownload />
          </a>
        </div>
      </div>

      {/* Impact Highlights - Row 2 */}
      <div className="card grid-impact">
        <span className="corner-icon"><FaRegLightbulb /></span>
        <h2>
          <span className="metal">Impact Highlights</span>
        </h2>
        <div className="list">
          <div className="list-item"><span className="icon-circle"><FaHotel /></span> Reduced manual processing time by 120% for Marriott/City Express.</div>
          <div className="list-item"><span className="icon-circle"><FaMobile /></span> UPocket app serves 15,000+ students, cutting schedule conflicts by 80%.</div>
          <div className="list-item"><span className="icon-circle"><FaRobot /></span> WhatsApp bot shortened Airbnb response time from 5 min → 30 sec.</div>
        </div>
      </div>

      {/* Workflow Highlights - Row 2 */}
      <div className="card grid-workflow">
        <span className="corner-icon"><FaRegStar /></span>
        <h2>
          <span className="metal">Workflow Highlights</span>
        </h2>
        <div className="list">
          <div className="list-item"><span className="icon-circle"><FaBullseye /></span>Goals & Objectives</div>
          <div className="list-item"><span className="icon-circle"><FaSearch /></span>Research</div>
          <div className="list-item"><span className="icon-circle"><FaFileAlt /></span>Design Docs</div>
          <div className="list-item"><span className="icon-circle"><FaFlask /></span>Prototyping</div>
          <div className="list-item"><span className="icon-circle"><FaRocket /></span>Finalize & Deploy</div>
        </div>
      </div>

      {/* Online Presence - Row 3 */}
      <div className="card grid-online">
        <span className="corner-icon"><IoPhonePortraitOutline /></span>
        <h2>
          <span className="metal">Online Presence</span>
        </h2>
        <div className="list">
          {socialLinks.map(({ href, icon: Icon, title, label }) => (
            <a key={href} className="social-link" href={href} target="_blank" rel="noopener noreferrer" title={title}>
              <Icon /> {label}
            </a>
          ))}
        </div>
      </div>

      {/* Contact - Row 3 */}
      <div className="card grid-contact">
        <span className="corner-icon"><FaCrown /></span>
        <div className="contact-card">
          <h2>
            <span className="metal">Let's Work Together</span>
          </h2>
          <p className="contact-text">Let's make magic happen together!</p>
          <a 
            className="button primary-button" 
            href="mailto:me@luiscedillo.com?subject=Let's%20Work%20Together&body=Hi%20Luis,%0A%0AI'm%20interested%20in%20working%20with%20you%20on%20a%20project.%20Let's%20discuss%20further!%0A%0ABest%20regards,"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaEnvelope /> Email Me
          </a>
          <a 
            className="button primary-button" 
            href="/contact"
          >
            <FaCalendarAlt /> Schedule a Call
          </a>
        </div>
      </div>
      {/* Organizations - Row 3 */}
      <div className="card grid-orgs">
        <span className="corner-icon"><GoOrganization /></span>
        <h2>
          <span className="metal">Organizations</span>
        </h2>
        <div className="orgs">
          <span className="org-tag"><FaHotel /> Marriott / City Express</span>
          <span className="org-tag"><IoMdSchool /> Universidad Panamericana</span>
          <span className="org-tag"><FaCode /> Nyx Technology</span>
          <span className="org-tag"><FaBriefcase /> Freelance Clients</span>
        </div>
      </div>


      {/* Skills with proper library icons - Row 4 */}
      <div className="card grid-skills">
        <span className="corner-icon"><FaCode /></span>
        <h2>
          <span className="metal">Solutions Suite</span>
        </h2>
        <div className="skills-grid">
          {/* Backend */}
          <div className="skill-group">
            <h3>
              <span className="metal">Backend Skills</span>
            </h3>
            <div className="skill-badges">
              <span className="skill-badge"><FaPython className="icon" />Python</span>
              <span className="skill-badge"><FaCode className="icon" />C++</span>
              <span className="skill-badge"><FaRust className="icon" />Rust</span>
              <span className="skill-badge"><FaTerminal className="icon" />Bash</span>
            </div>
          </div>
          {/* Frontend */}
          <div className="skill-group">
            <h3>
              <span className="metal">Frontend Skills</span>
            </h3>
            <div className="skill-badges">
              <span className="skill-badge"><FaJs className="icon" />JavaScript</span>
              <span className="skill-badge"><FaReact className="icon" />React</span>
              <span className="skill-badge"><FaCss3 className="icon" />CSS</span>
              <span className="skill-badge"><FaSwift className="icon" />Swift</span>
            </div>
          </div>
          {/* Databases & Cloud */}
          <div className="skill-group">
            <h3>
              <span className="metal">Databases & Cloud</span>
            </h3>
            <div className="skill-badges">
              <span className="skill-badge"><FaDatabase className="icon" />PostgreSQL</span>
              <span className="skill-badge"><FaServer className="icon" />MySQL</span>
              <span className="skill-badge"><FaAws className="icon" />AWS</span>
              <span className="skill-badge"><FaDocker className="icon" />Docker</span>
            </div>
          </div>
          {/* Soft Skills */}
          <div className="skill-group">
            <h3>
              <span className="metal">Soft Skills</span>
            </h3>
            <div className="skill-badges">
              <span className="skill-badge"><FaTasks className="icon" />Agile/Scrum</span>
              <span className="skill-badge"><FaUsers className="icon" />Team Working</span>
              <span className="skill-badge"><FaUserTie className="icon" />Leadership</span>
              <span className="skill-badge"><FaComments className="icon" />Communication</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BentoGrid;
