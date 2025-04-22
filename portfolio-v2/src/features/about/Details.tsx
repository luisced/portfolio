import React from 'react';
import { 
  backendSkills, 
  frontendSkills, 
  databasesAndCloudSkills, 
  timelineItems,
  languages,
  busyWith,
  education
} from './DetailsData';
import './Details.css';

// Skill component
interface SkillsProps {
  title: string;
  skills: {
    name: string;
    percent: number;
    color: string;
    delay: number;
  }[];
}

const Skills: React.FC<SkillsProps> = ({ title, skills }) => (
  <div className="skills">
    <h3>{title}</h3>
    <div className="skills-list">
      {skills.map((skill, index) => (
        <div className="skill-item" key={index} style={{ animationDelay: `${skill.delay}ms` }}>
          <div className="skill-info">
            <span className="skill-name">{skill.name}</span>
            <span className="skill-percent">{skill.percent}%</span>
          </div>
          <div className="skill-bar">
            <div 
              className="skill-progress" 
              style={{ 
                width: `${skill.percent}%`, 
                background: skill.color 
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Timeline component
interface TimelineProps {
  items: {
    title: string;
    date: string;
    status: string;
    info: {
      title: string;
      content: string;
    };
  }[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => (
  <div className="timeline">
    <h3>Experience</h3>
    <div className="timeline-container">
      {items.map((item, index) => (
        <div className={`timeline-item ${item.status}`} key={index}>
          <div className="timeline-marker"></div>
          <div className="timeline-content">
            <h4>{item.title}</h4>
            <p className="timeline-date">{item.date}</p>
            <div className="timeline-info">
              <h5>{item.info.title}</h5>
              <p>{item.info.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ExtraInfo component
const ExtraInfo: React.FC = () => (
  <div className="extra-info">
    <div className="info-section">
      <h3>Languages</h3>
      <ul>
        {languages.map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
    </div>
    
    <div className="info-section">
      <h3>Currently Busy With</h3>
      <ul>
        {busyWith.map((activity, index) => (
          <li key={index}>{activity}</li>
        ))}
      </ul>
    </div>
    
    <div className="info-section">
      <h3>Education</h3>
      <ul>
        {education.map((edu, index) => (
          <li key={index}>{edu}</li>
        ))}
      </ul>
    </div>
  </div>
);

// Main Details component
const Details: React.FC = () => (
  <div className="details">
    <div className="skills-container">
      <Skills title="Backend Skills" skills={backendSkills} />
      <Skills title="Frontend Skills" skills={frontendSkills} />
      <Skills title="Databases & Cloud Skills" skills={databasesAndCloudSkills} />
    </div>
    <Timeline items={timelineItems} />
    <ExtraInfo />
  </div>
);

export default Details;
