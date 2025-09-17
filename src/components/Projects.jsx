import React, { useState } from 'react';
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { PROJECTS, PROJECT_CATEGORIES } from "../constants";

// Repository Card Component (GitHub-style)
const RepositoryCard = ({ project, index }) => {
  const handleCardClick = () => {
    if (project.githubUrl && project.githubUrl !== "#") {
      window.open(project.githubUrl, '_blank');
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-neutral-900 border border-neutral-700 rounded-lg p-4 hover:border-neutral-500 transition-all duration-200 ${
        project.githubUrl && project.githubUrl !== "#" ? "cursor-pointer hover:bg-neutral-700" : ""
      }`}
    >
      {/* Repository Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 text-neutral-400">
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>
            </svg>
          </div>
          <h3 className="text-blue-400 font-semibold text-lg hover:underline">
            {project.name}
          </h3>
          <span className="text-xs px-2 py-1 border border-neutral-600 rounded-full text-neutral-400">
            {project.visibility}
          </span>
        </div>
      </div>

      {/* Fork indicator */}
      {project.forkedFrom && (
        <div className="flex items-center text-xs text-neutral-400 mb-2">
          <svg className="w-3 h-3 mr-1" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878z"/>
          </svg>
          Forked from <span className="text-blue-400">{project.forkedFrom}</span>
        </div>
      )}

      {/* Description */}
      <p className="text-neutral-300 text-sm mb-4 leading-relaxed">
        {project.description}
      </p>

      {/* Topics */}
      {project.topics && project.topics.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {project.topics.slice(0, 4).map((topic, topicIndex) => (
            <span
              key={topicIndex}
              className="text-xs px-2 py-1 bg-blue-900/30 text-blue-300 rounded-full border border-blue-800/50"
            >
              {topic}
            </span>
          ))}
          {project.topics.length > 4 && (
            <span className="text-xs px-2 py-1 text-neutral-400">
              +{project.topics.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Repository Stats */}
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center space-x-4">
          {/* Language */}
          <div className="flex items-center space-x-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: project.languageColor }}
            ></div>
            <span>{project.language}</span>
          </div>
          
          {/* Stars */}
          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
            </svg>
            <span>{project.stars}</span>
          </div>

          {/* Forks */}
          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878z"/>
            </svg>
            <span>{project.forks}</span>
          </div>
        </div>

        <span>Updated {project.updated}</span>
      </div>
    </div>
  );
};

// Directory Section Component
const DirectorySection = ({ categoryKey, category, projects, isExpanded, onToggle, index }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const slideInVariants = {
    hidden: { 
      x: -100,
      opacity: 0
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.15,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      ref={ref}
      variants={slideInVariants}
      initial="hidden"
      animate={controls}
      className="mb-8"
    >
      {/* Directory Header */}
      <div 
        className="flex items-center space-x-3 mb-4 cursor-pointer hover:bg-neutral-700/80 p-2 rounded-lg transition-all duration-300 group"
        onClick={() => onToggle(categoryKey)}
      >
        <div className="text-transparent bg-gradient-to-r from-blue-400 via-white to-cyan-400 bg-clip-text animate-gradient-x group-hover:from-cyan-400 group-hover:via-blue-500 group-hover:to-white transition-all duration-500">
          {isExpanded ? (
            <svg className="w-4 h-4 text-blue-400" viewBox="0 0 16 16" fill="currentColor">
              <path d="M12.78 5.22a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0L3.22 6.28a.75.75 0 011.06-1.06L8 8.94l3.72-3.72a.75.75 0 011.06 0z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4 text-blue-400" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z"/>
            </svg>
          )}
        </div>
        <div className="w-5 h-5 text-transparent bg-gradient-to-r from-blue-400 via-white to-cyan-400 bg-clip-text animate-gradient-x group-hover:from-cyan-400 group-hover:via-blue-500 group-hover:to-white transition-all duration-500">
          <svg viewBox="0 0 16 16" fill="currentColor" className="text-blue-400">
            <path d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3H7.5a.25.25 0 01-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75z"/>
          </svg>
        </div>
        <span className="text-transparent bg-gradient-to-r from-blue-400 via-white to-cyan-400 bg-clip-text font-mono text-lg font-medium animate-gradient-x group-hover:from-cyan-400 group-hover:via-blue-500 group-hover:to-white transition-all duration-500">
          {category.name}
        </span>
        <span className="text-neutral-400 text-sm group-hover:text-neutral-300 transition-colors duration-300">({projects.length})</span>
      </div>

      {/* Directory Description */}
      {isExpanded && (
        <div className="ml-12 mb-4">
          <p className="text-neutral-400 text-sm italic"># {category.description}</p>
        </div>
      )}

      {/* Projects Grid */}
      <div 
        className={`ml-8 overflow-hidden transition-all duration-500 ease-out ${
          isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
          {projects.map((project, index) => (
            <div
              key={project.name}
              className={`transform transition-all duration-300 ease-out ${
                isExpanded 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-4 opacity-0'
              }`}
              style={{
                transitionDelay: isExpanded ? `${index * 50}ms` : '0ms'
              }}
            >
              <RepositoryCard project={project} index={index} />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const [expandedCategories, setExpandedCategories] = useState({
    research: false,
    mlExperiments: false,
    embedded: false,
    webDev: false,
    tools: false
  });

  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const toggleCategory = (categoryKey) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  return (
    <div className="border-b border-neutral-900 pb-8">
      {/* Terminal Header */}
      <motion.div
        ref={ref}
        variants={titleVariants}
        initial="hidden"
        animate={controls}
        className="my-20"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Projects</h1>
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="font-mono text-sm text-white">
              will@portfolio:~/projects$ ls -la
            </div>
          </div>
        </div>
      </motion.div>

      {/* Project Categories */}
      <div className="max-w-6xl mx-auto px-4">
        {Object.entries(PROJECT_CATEGORIES).map(([categoryKey, category], index) => (
          <DirectorySection
            key={categoryKey}
            categoryKey={categoryKey}
            category={category}
            projects={PROJECTS[categoryKey] || []}
            isExpanded={expandedCategories[categoryKey]}
            onToggle={toggleCategory}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Projects;