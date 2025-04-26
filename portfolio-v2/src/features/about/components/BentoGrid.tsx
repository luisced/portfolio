import React from 'react';
import { useTranslation } from 'react-i18next';
import './BentoGrid.css';
import profilePic from '../../../assets/images/pfp.webp';
import cv from '../../../assets/documents/Luis Cedillo Maldonado CV.pdf';
import GitHubCalendar from 'react-github-calendar';
import { useTheme } from '../../../contexts/ThemeContext';

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
  const { t } = useTranslation();
  return (
    <div className="bento-grid">
      {/* Stat Cards - Row 1 */}
      <div className="card stat grid-years">
        <span className="big metal">04<span className="plus">+</span></span>
        <span className="label-badge"><FaRegClock /> {t('about.bentoGrid.stats.yearsExperience')}</span>
      </div>
      <div className="card stat grid-projects">
        <span className="big metal">10<span className="plus">+</span></span>
        <span className="label-badge"><FaCode /> {t('about.bentoGrid.stats.projects')}</span>
      </div>
      
      {/* GitHub Calendar Card - Row 1 */}
      <div className="card grid-github">
        <span className="corner-icon"><FaGithub /></span>
        <h2>
          <span className="metal">{t('about.bentoGrid.sections.githubContributions')}</span>
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
              <span className="metal">{t('about.bentoGrid.profile.name')}</span>
            </h2>
            <div className="badge"><FaCircle className="badge-dot" /> {t('about.bentoGrid.profile.available')}</div>
          </div>
          
        </div>
        <p className="profile-bio">
          {t('about.bentoGrid.profile.bio')}
        </p>
        <div className="tags">
          <span className="tag"><IoLocationSharp /> {t('about.bentoGrid.profile.tags.mexico')}</span>
          <span className="tag"><TbWorld /> {t('about.bentoGrid.profile.tags.languages')}</span>
          <span className="tag"><FaLaptopCode /> {t('about.bentoGrid.profile.tags.role')}</span>
          <span className="tag"><FaRegClock /> {t('about.bentoGrid.profile.tags.timezone')}</span>
          <span className="tag"><IoMdSchool /> {t('about.bentoGrid.profile.tags.university')}</span>
        </div>
        <div className="contact-buttons">
          <a className="button primary-button" href="https://wa.me/5571967146">
            <FaWhatsapp /> {t('about.bentoGrid.profile.buttons.whatsapp')}
          </a>
          <a className="button primary-button"  href={cv} download="Luis_Cedillo_Maldonado_CV.pdf">
            {t('about.bentoGrid.profile.buttons.resume')} <FaDownload />
          </a>
        </div>
      </div>

      {/* Impact Highlights - Row 2 */}
      <div className="card grid-impact">
        <span className="corner-icon"><FaRegLightbulb /></span>
        <h2>
          <span className="metal">{t('about.bentoGrid.sections.impactHighlights')}</span>
        </h2>
        <div className="list">
          <div className="list-item"><span className="icon-circle"><FaHotel /></span> {t('about.bentoGrid.impact.marriott')}</div>
          <div className="list-item"><span className="icon-circle"><FaMobile /></span> {t('about.bentoGrid.impact.upocket')}</div>
          <div className="list-item"><span className="icon-circle"><FaRobot /></span> {t('about.bentoGrid.impact.whatsapp')}</div>
        </div>
      </div>

      {/* Workflow Highlights - Row 2 */}
      <div className="card grid-workflow">
        <span className="corner-icon"><FaRegStar /></span>
        <h2>
          <span className="metal">{t('about.bentoGrid.sections.workflowHighlights')}</span>
        </h2>
        <div className="list">
          <div className="list-item"><span className="icon-circle"><FaBullseye /></span>{t('about.bentoGrid.workflow.goals')}</div>
          <div className="list-item"><span className="icon-circle"><FaSearch /></span>{t('about.bentoGrid.workflow.research')}</div>
          <div className="list-item"><span className="icon-circle"><FaFileAlt /></span>{t('about.bentoGrid.workflow.design')}</div>
          <div className="list-item"><span className="icon-circle"><FaFlask /></span>{t('about.bentoGrid.workflow.prototype')}</div>
          <div className="list-item"><span className="icon-circle"><FaRocket /></span>{t('about.bentoGrid.workflow.deploy')}</div>
        </div>
      </div>

      {/* Online Presence - Row 3 */}
      <div className="card grid-online">
        <span className="corner-icon"><IoPhonePortraitOutline /></span>
        <h2>
          <span className="metal">{t('about.bentoGrid.sections.onlinePresence')}</span>
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
            <span className="metal">{t('about.bentoGrid.sections.workTogether')}</span>
          </h2>
          <p className="contact-text">{t('about.bentoGrid.contact.message')}</p>
          <a 
            className="button primary-button" 
            href="mailto:me@luiscedillo.com?subject=Let's%20Work%20Together&body=Hi%20Luis,%0A%0AI'm%20interested%20in%20working%20with%20you%20on%20a%20project.%20Let's%20discuss%20further!%0A%0ABest%20regards,"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaEnvelope /> {t('about.bentoGrid.contact.email')}
          </a>
          <a 
            className="button primary-button" 
            href="/contact"
          >
            <FaCalendarAlt /> {t('about.bentoGrid.contact.schedule')}
          </a>
        </div>
      </div>
      {/* Organizations - Row 3 */}
      <div className="card grid-orgs">
        <span className="corner-icon"><GoOrganization /></span>
        <h2>
          <span className="metal">{t('about.bentoGrid.sections.organizations')}</span>
        </h2>
        <div className="orgs">
          <span className="org-tag"><FaHotel /> {t('about.bentoGrid.organizations.marriott')}</span>
          <span className="org-tag"><IoMdSchool /> {t('about.bentoGrid.organizations.university')}</span>
          <span className="org-tag"><FaCode /> {t('about.bentoGrid.organizations.nyx')}</span>
          <span className="org-tag"><FaBriefcase /> {t('about.bentoGrid.organizations.freelance')}</span>
        </div>
      </div>


      {/* Skills with proper library icons - Row 4 */}
      <div className="card grid-skills">
        <span className="corner-icon"><FaCode /></span>
        <h2>
          <span className="metal">{t('about.bentoGrid.sections.solutionsSuite')}</span>
        </h2>
        <div className="skills-grid">
          {/* Backend */}
          <div className="skill-group">
            <h3>
              <span className="metal">{t('about.bentoGrid.skills.backend')}</span>
            </h3>
            <div className="skill-badges">
              <span className="skill-badge"><FaPython className="icon" />{t('about.bentoGrid.skills.backendSkills.python')}</span>
              <span className="skill-badge"><FaCode className="icon" />{t('about.bentoGrid.skills.backendSkills.cpp')}</span>
              <span className="skill-badge"><FaRust className="icon" />{t('about.bentoGrid.skills.backendSkills.rust')}</span>
              <span className="skill-badge"><FaTerminal className="icon" />{t('about.bentoGrid.skills.backendSkills.bash')}</span>
            </div>
          </div>
          {/* Frontend */}
          <div className="skill-group">
            <h3>
              <span className="metal">{t('about.bentoGrid.skills.frontend')}</span>
            </h3>
            <div className="skill-badges">
              <span className="skill-badge"><FaJs className="icon" />{t('about.bentoGrid.skills.frontendSkills.javascript')}</span>
              <span className="skill-badge"><FaReact className="icon" />{t('about.bentoGrid.skills.frontendSkills.react')}</span>
              <span className="skill-badge"><FaCss3 className="icon" />{t('about.bentoGrid.skills.frontendSkills.css')}</span>
              <span className="skill-badge"><FaSwift className="icon" />{t('about.bentoGrid.skills.frontendSkills.swift')}</span>
            </div>
          </div>
          {/* Databases & Cloud */}
          <div className="skill-group">
            <h3>
              <span className="metal">{t('about.bentoGrid.skills.databases')}</span>
            </h3>
            <div className="skill-badges">
              <span className="skill-badge"><FaDatabase className="icon" />{t('about.bentoGrid.skills.databasesSkills.postgresql')}</span>
              <span className="skill-badge"><FaServer className="icon" />{t('about.bentoGrid.skills.databasesSkills.mysql')}</span>
              <span className="skill-badge"><FaAws className="icon" />{t('about.bentoGrid.skills.databasesSkills.aws')}</span>
              <span className="skill-badge"><FaDocker className="icon" />{t('about.bentoGrid.skills.databasesSkills.docker')}</span>
            </div>
          </div>
          {/* Soft Skills */}
          <div className="skill-group">
            <h3>
              <span className="metal">{t('about.bentoGrid.skills.soft')}</span>
            </h3>
            <div className="skill-badges">
              <span className="skill-badge"><FaTasks className="icon" />{t('about.bentoGrid.skills.softSkills.agile')}</span>
              <span className="skill-badge"><FaUsers className="icon" />{t('about.bentoGrid.skills.softSkills.teamwork')}</span>
              <span className="skill-badge"><FaUserTie className="icon" />{t('about.bentoGrid.skills.softSkills.leadership')}</span>
              <span className="skill-badge"><FaComments className="icon" />{t('about.bentoGrid.skills.softSkills.communication')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BentoGrid;
