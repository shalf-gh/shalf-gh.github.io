import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  link: string;
  image: string | ((theme: string) => string);
  github?: string;
}

import ThemeBackground from './components/ThemeBackground';
import CluemojiGame from './pages/CluemojiGame';
import MaryPage from './pages/MaryPage';

const getProjectEmoji = (theme: string) => {
  const emojiMap = {
    water: '🐟',
    space: '🔭'
  };
  return emojiMap[theme as keyof typeof emojiMap] || '🐟';
};

const projects: Project[] = [
  {
    id: 1,
    title: "For Mary",
    description: "First Anniversary",
    technologies: ["React", "TypeScript", "Framer Motion"],
    link: "/mary",
    image: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-size='100'>❤️</text></svg>`
  },
  {
    id: 2,
    title: "Cluemoji",
    description: "New clue every week.",
    technologies: ["React", "TypeScript", "Tailwind"],
    link: "/cluemoji",
    image: (theme: string) => `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' font-size='100'>${getProjectEmoji(theme)}</text></svg>`
  }
];

function AppContent() {
  const [theme, setTheme] = useState('space');
  const themes = ['space', 'water'];
  const location = useLocation();

  const cycleTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  // Check if we're on the Mary page
  const isMaryPage = location.pathname === '/mary';

  return (
    <div className="min-h-screen relative">
      {/* Background layer */}
      <div className="fixed inset-0 -z-10">
        <ThemeBackground theme={theme as 'water' | 'space'} />
      </div>
      
      {/* Content layer */}
      <div className="relative z-10">
        {/* Navigation - only show on non-Mary pages */}
        {!isMaryPage && (
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
              </div>
            </div>
          </div>
        </nav>
        )}

        <Routes>
          <Route path="/cluemoji" element={<CluemojiGame />} />
          <Route path="/mary" element={<MaryPage />} />
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
                      className="relative"
                    >
                      <button
                        onClick={cycleTheme}
                        className="btn btn-primary"
                      >
                        Theme: {theme}
                      </button>
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
                        src={typeof project.image === 'function' ? project.image(theme) : project.image}
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
