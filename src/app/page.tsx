'use client';

import { useEffect, useRef } from 'react';
import RecruiterPanel from '@/components/ui/RecruiterPanel';
import resumeData from '@/data/resume.json';

export default function Home() {
  const sectionsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  return (
    <main className="container">
      <header className="header">
        <h1>{resumeData.name}</h1>
        <h2>{resumeData.title}</h2>
        <p>{resumeData.summary}</p>
      </header>

      <section
        className="section"
        ref={(el) => (sectionsRef.current[0] = el!)}
      >
        <h2 className="section-title">Skills</h2>
        <div className="skills-grid">
          {resumeData.skills.map((skill, index) => (
            <div key={index} className="skill-card">
              {skill.name}
            </div>
          ))}
        </div>
      </section>

      <section
        className="section"
        ref={(el) => (sectionsRef.current[1] = el!)}
      >
        <h2 className="section-title">Projects</h2>
        <div className="projects-grid">
          {resumeData.projects.map((project, index) => (
            <div key={index} className="project-card">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div className="skills-used">
                {project.skillsUsed.map((skill, skillIndex) => (
                  <span key={skillIndex} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="section"
        ref={(el) => (sectionsRef.current[2] = el!)}
      >
        <RecruiterPanel />
      </section>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 60px;
        }
        .section {
          margin-bottom: 60px;
        }
        .section-title {
          text-align: center;
          margin-bottom: 40px;
        }
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 15px;
        }
        .skill-card {
          background-color: #1a1a1a;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }
        .projects-grid {
          display: grid;
          gap: 20px;
        }
        .project-card {
          background-color: #1a1a1a;
          padding: 20px;
          border-radius: 8px;
        }
        .skills-used {
          margin-top: 15px;
        }
        .skill-tag {
          background-color: #333;
          color: #eee;
          padding: 5px 10px;
          border-radius: 5px;
          margin-right: 5px;
          font-size: 12px;
        }
      `}</style>
    </main>
  );
}
