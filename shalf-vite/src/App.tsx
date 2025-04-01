import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import WaterBackground from './components/WaterBackground';

const projects = [
  {
    title: "Project 1",
    description: "Description of project 1",
    technologies: ["React", "TypeScript", "Tailwind"],
    image: "https://via.placeholder.com/400x300",
    link: "#"
  },
  {
    title: "Project 2",
    description: "Description of project 2",
    technologies: ["Node.js", "Express", "MongoDB"],
    image: "https://via.placeholder.com/400x300",
    link: "#"
  },
  // Add more projects as needed
];

function App() {
  const [activeSection, setActiveSection] = useState('home');

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'projects', 'about', 'contact'];
      // Offset for header
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          if (top <= 100 && bottom > 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
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
                onClick={() => scrollToSection('home')}
              >
                Shalf
              </motion.h1>
              <div className="flex gap-6">
                {['home', 'projects', 'about', 'contact'].map((section) => (
                  <motion.button
                    key={section}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => scrollToSection(section)}
                    className={`capitalize ${
                      activeSection === section ? 'text-blue-500' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {section}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </nav>

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
                <button onClick={() => scrollToSection('projects')} className="btn btn-primary">
                  View My Work
                </button>
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
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a href={project.link} className="text-blue-500 hover:text-blue-400">
                    View Project →
                  </a>
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
                <a href="mailto:your.email@example.com" className="btn btn-primary">
                  Send Message
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 bg-black">
          <div className="container text-center text-gray-400">
            <p>© 2024 Shalf. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-4">
              <a href="#" className="hover:text-blue-500 transition-colors">GitHub</a>
              <a href="#" className="hover:text-blue-500 transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Twitter</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
