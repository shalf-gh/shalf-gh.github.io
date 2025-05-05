import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  link: string;
  image: string;
  github?: string;
}

import ThemeBackground from './components/ThemeBackground';
import CluemojiGame from './pages/CluemojiGame';

const projects: Project[] = [
  {
    id: 1,
    title: "Cluemoji",
    description: "New clue every week.",
    technologies: ["React", "TypeScript", "Tailwind"],
    link: "/cluemoji",
    image: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-size='150'>🐟</text></svg>`
  }
];

function AppContent() {
  const [activeSection, setActiveSection] = useState('home');
  const [showProjectsDropdown, setShowProjectsDropdown] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<number | null>(null);

  const handleProjectsMouseEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
    }
    setShowProjectsDropdown(true);
  };

  const handleProjectsMouseLeave = () => {
    const timeoutId = window.setTimeout(() => {
      setShowProjectsDropdown(false);
    }, 200);
    setDropdownTimeout(timeoutId);
  };

  // Update active section based on scroll position and current path
  useEffect(() => {
    const handleScroll = () => {
      // If we're on a project page, keep Projects highlighted
      if (window.location.pathname !== '/') {
        setActiveSection('projects');
        return;
      }

      const sections = ['home', 'projects'];
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
    <div className="min-h-screen relative">
      {/* Background layer */}
      <div className="fixed inset-0 -z-10">
        <ThemeBackground />
      </div>
      
      {/* Content layer */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-opacity-50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex-shrink-0">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-2xl font-bold text-white"
                  >
                    shalf
                  </motion.div>
                </Link>
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    to="/#home"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${activeSection === 'home' ? 'text-white bg-blue-600 bg-opacity-50' : 'text-gray-300 hover:bg-blue-600 hover:bg-opacity-30 hover:text-white'}`}
                  >
                    Home
                  </Link>
                  <div
                    className="relative group"
                    onMouseEnter={handleProjectsMouseEnter}
                    onMouseLeave={handleProjectsMouseLeave}
                  >
                    <Link
                      to="/#projects"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${activeSection === 'projects' ? 'text-white bg-blue-600 bg-opacity-50' : 'text-gray-300 hover:bg-blue-600 hover:bg-opacity-30 hover:text-white'}`}
                    >
                      Projects
                    </Link>
                    {showProjectsDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                      >
                        <div
                          className="py-1"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="projects-menu"
                        >
                          {projects.map((project) => (
                            <Link
                              key={project.id}
                              to={project.link}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                              role="menuitem"
                            >
                              {project.title}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
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
                      Full Stack Developer | UI/UX Designer
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
            <section id="projects" className="py-16 min-h-screen flex flex-col justify-center">
              <div className="container">
                <h2 className="section-title text-center text-white text-4xl mb-12">My Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {projects.map((project) => (
                    <motion.div
                      key={project.id}
                      className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-56 object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="p-8">
                        <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">{project.title}</h3>
                        <p className="text-gray-300 mb-6 leading-relaxed">{project.description}</p>
                        <div className="flex space-x-4">
                          {project.link && (
                            <Link
                              to={project.link}
                              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                            >
                              View Project
                            </Link>
                          )}
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors"
                            >
                              GitHub
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-black">
              <div className="container text-center text-gray-400">
                <p> 2025 shalf. rights probably not reserved.</p>
                <div className="flex justify-center gap-4 mt-4">
                  <a href="#" className="hover:text-blue-500 transition-colors">GitHub</a>
                  <a href="#" className="hover:text-blue-500 transition-colors">LinkedIn</a>
                  {/* <a href="#" className="hover:text-blue-500 transition-colors">Twitter</a> */}
                </div>
              </div>
            </footer>
            </>
          } />
        </Routes>
      </div>
    </div>
  );
}

function RedirectHandler({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const redirect = sessionStorage.redirect;
    if (redirect && redirect !== location.pathname) {
      sessionStorage.removeItem('redirect');
      navigate(redirect, { replace: true });
    } else {
      setIsReady(true);
    }
  }, [navigate]);

  return isReady ? <>{children}</> : null;
}

function App() {
  return (
    <Router>
      <RedirectHandler>
        <AppContent />
      </RedirectHandler>
    </Router>
  );
}

export default App;
