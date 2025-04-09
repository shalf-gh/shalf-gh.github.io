import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import WaterBackground from './components/WaterBackground';
import CluemojiGame from './pages/CluemojiGame';

const projects = [
  {
    title: "Cluemoji",
    description: "New clue every week.",
    technologies: ["React", "TypeScript", "Tailwind"],
    link: "/cluemoji"
  }
];

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [showProjectsDropdown, setShowProjectsDropdown] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<number | null>(null);
  const navigate = useNavigate();

  // Handle redirect from 404.html
  useEffect(() => {
    const redirect = sessionStorage.redirect;
    delete sessionStorage.redirect;
    if (redirect && redirect !== location.pathname) {
      navigate(redirect);
    }
  }, [navigate]);

  // Update active section based on scroll position and current path
  useEffect(() => {
    const handleScroll = () => {
      // If we're on a project page, keep Projects highlighted
      if (window.location.pathname !== '/') {
        setActiveSection('projects');
        return;
      }

      const sections = ['home', 'projects', 'about', 'contact'];
      const scrollPosition = window.scrollY + 100; // Add header offset

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    // Handle initial hash and hash changes
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          // Add offset for fixed header
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          setActiveSection(hash);
        }
      }
    };

    // Set initial active section based on current path
    if (window.location.pathname !== '/') {
      setActiveSection('projects');
    } else {
      handleHashChange();
    }

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

  // Add click handler for navigation links
  const handleNavClick = (e: React.MouseEvent, section: string) => {
    e.preventDefault();
    
    // If we're not on the root page, navigate to root first
    if (window.location.pathname !== '/') {
      window.location.href = `/#${section}`;
      return;
    }

    // If we're on the root page, just scroll
    const element = document.getElementById(section);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      window.location.hash = section;
      setActiveSection(section);
    }
  };

  const handleMouseEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
    }
    setShowProjectsDropdown(true);
  };

  const handleMouseLeave = () => {
    const timeout = window.setTimeout(() => {
      setShowProjectsDropdown(false);
    }, 1000);
    setDropdownTimeout(timeout);
  };

  return (
    <Router>
      <div className="min-h-screen relative">
        {/* Background layer */}
        <div className="fixed inset-0 -z-10">
          <WaterBackground />
        </div>
        
        {/* Content layer */}
        <div className="relative z-10">
          {/* Navigation */}
          <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-sm z-50">
            <div className="container py-4">
              <div className="flex items-center justify-between">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl font-bold text-blue-500 cursor-pointer"
                >
                  <Link to="/" className="hover:text-blue-400">Shalf</Link>
                </motion.h1>
                <div className="flex gap-6">
                  <Link
                    to="/#home"
                    onClick={(e) => handleNavClick(e, 'home')}
                    className={`capitalize ${
                      activeSection === 'home' ? 'text-blue-500' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      home
                    </motion.span>
                  </Link>
                  <div 
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`capitalize ${
                        activeSection === 'projects' ? 'text-blue-500' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Projects
                    </motion.button>
                    {showProjectsDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-0 mt-2 bg-black/90 backdrop-blur-sm rounded-lg shadow-lg py-2 min-w-[200px]"
                      >
                        {projects.map((project) => (
                          <Link
                            key={project.title}
                            to={project.link}
                            className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-blue-500/20"
                          >
                            {project.title}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>
                  {['about', 'contact'].map((section) => (
                    <Link
                      key={section}
                      to={`/#${section}`}
                      onClick={(e) => handleNavClick(e, section)}
                      className={`capitalize ${
                        activeSection === section ? 'text-blue-500' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {section}
                      </motion.span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <Routes>
            <Route path="/cluemoji" element={<CluemojiGame />} />
            <Route path="/" element={
              <>
                {/* Hero Section */}
                <section id="home" className="pt-32 pb-16">
                  <div className="container">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-center"
                    >
                      <h1 className="text-5xl font-bold mb-6 text-white">
                        Hi, I'm <span className="text-blue-500">Shalf</span>
                      </h1>
                      <p className="text-xl text-gray-300 mb-8">
                        Full Stack Developer | UI/UX Designer | Problem Solver
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link to="/#projects" className="btn btn-primary">
                          View My Work
                        </Link>
                      </motion.div>
                    </motion.div>
                  </div>
                </section>

                {/* Projects Section */}
                <section id="projects" className="py-16">
                  <div className="container">
                    <h2 className="section-title text-center text-white">Featured Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {projects.map((project, index) => (
                        <motion.div
                          key={project.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="card bg-black/50 backdrop-blur-sm"
                        >
                          <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
                          <p className="text-gray-300 mb-4">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.map((tech) => (
                              <span key={tech} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
                                {tech}
                              </span>
                            ))}
                          </div>
                          <Link to={project.link} className="text-blue-500 hover:text-blue-400">
                            View Project →
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* About Section */}
                <section id="about" className="py-16">
                  <div className="container">
                    <h2 className="section-title text-center text-white">About Me</h2>
                    <div className="max-w-2xl mx-auto text-center">
                      <p className="text-gray-300 mb-6">
                        I'm a passionate developer with expertise in building modern web applications.
                        I love creating beautiful and functional user interfaces while ensuring
                        robust backend functionality.
                      </p>
                      <div className="flex flex-wrap justify-center gap-4">
                        {['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python'].map((skill) => (
                          <span key={skill} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-16">
                  <div className="container">
                    <h2 className="section-title text-center text-white">Get in Touch</h2>
                    <div className="max-w-xl mx-auto text-center">
                      <p className="text-gray-300 mb-8">
                        I'm always open to discussing new projects, creative ideas, or opportunities
                        to be part of your visions.
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <a href="mailto:sccunin@gmail.com" className="btn btn-primary">
                          Send Message
                        </a>
                      </motion.div>
                    </div>
                  </div>
                </section>

                {/* Footer */}
                <footer className="py-8 bg-black">
                  <div className="container text-center text-gray-400">
                    <p>© 2025 Sean C. All rights reserved.</p>
                    <div className="flex justify-center gap-4 mt-4">
                      <a href="#" className="hover:text-blue-500 transition-colors">GitHub</a>
                      <a href="#" className="hover:text-blue-500 transition-colors">LinkedIn</a>
                      <a href="#" className="hover:text-blue-500 transition-colors">Twitter</a>
                    </div>
                  </div>
                </footer>
              </>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
