import { experience, profile, projects, type Project } from './data/portfolio';

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function ProjectRow({ project }: { project: Project }) {
  const content = (
    <>
      <span className="project-number" aria-hidden="true">{project.index}</span>
      <div className="project-copy">
        <p className="eyebrow">{project.eyebrow}</p>
        <h3>{project.title}</h3>
        <p className="project-summary">{project.summary}</p>
      </div>
      <div className="project-details">
        <span>{project.role}</span>
        <strong>{project.impact}</strong>
      </div>
      {project.href && <span className="project-arrow"><Arrow /></span>}
    </>
  );

  if (project.href) {
    return (
      <a
        className="project-row"
        href={project.href}
        target="_blank"
        rel="noreferrer"
        aria-label={`${project.title} — open project`}
      >
        {content}
      </a>
    );
  }

  return <article className="project-row project-row-static">{content}</article>;
}

function PortfolioApp() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <div className="site-shell">
        <header className="site-header" aria-label="Primary navigation">
          <a className="wordmark" href="#top" aria-label="Anmol Baruwal, home">
            <span className="wordmark-dot" aria-hidden="true" />
            Anmol Baruwal
          </a>
          <nav>
            <a href="#work">Work</a>
            <a href="#about">About</a>
            <a href={profile.resume} target="_blank" rel="noreferrer">Résumé</a>
          </nav>
        </header>

        <main id="main">
          <section className="hero" id="top" aria-labelledby="hero-title">
            <div className="hero-copy">
              <p className="eyebrow">{profile.title} · {profile.location}</p>
              <h1 id="hero-title">
                I build software that makes complex systems feel <em>simple.</em>
              </h1>
              <div className="hero-links" aria-label="Contact and profile links">
                <a href={`mailto:${profile.email}`}>Email me <Arrow /></a>
                <a href={profile.github} target="_blank" rel="noreferrer">GitHub <Arrow /></a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
              </div>
            </div>
          </section>

          <section className="section" id="work" aria-labelledby="work-title">
            <div className="section-intro">
              <div>
                <h2 id="work-title">A few things I’m proud to have built.</h2>
              </div>
            </div>

            <div className="project-list">
              {projects.map((project) => <ProjectRow key={project.title} project={project} />)}
            </div>
          </section>

          <section className="section about-section" id="about" aria-labelledby="about-title">
            <div className="section-intro about-intro">
              <div>
                <h2 id="about-title">Practical, curious, and human-centered.</h2>
                <p className="about-copy">{profile.about}</p>
                <p className="education-line">Fisk University · B.S. Computer Science · 2025</p>
              </div>
            </div>

            <div className="experience-list" aria-label="Selected experience">
              {experience.map((item) => {
                const organization = item.href ? (
                  <a href={item.href} target="_blank" rel="noreferrer">
                    {item.organization} <Arrow />
                  </a>
                ) : item.organization;

                return (
                  <div className="experience-row" key={`${item.organization}-${item.role}`}>
                    <strong>{organization}</strong>
                    <span>{item.role}</span>
                    <time>{item.year}</time>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="contact-section" aria-labelledby="contact-title">
            <h2 id="contact-title">Have a useful problem worth solving?</h2>
            <a className="contact-email" href={`mailto:${profile.email}`}>
              {profile.email} <Arrow />
            </a>
          </section>
        </main>

        <footer>
          <p>© {new Date().getFullYear()} {profile.name}</p>
          <p>Simple by design. Focused on the work.</p>
        </footer>
      </div>
    </>
  );
}

export default PortfolioApp;
