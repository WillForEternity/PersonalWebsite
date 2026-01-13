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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={handleCardClick}
      className={`bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-xl p-5 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300 ${
        project.githubUrl && project.githubUrl !== "#" ? "cursor-pointer" : ""
      }`}
    >
      {/* Repository Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 text-cyan-400/60">
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>
            </svg>
          </div>
          <h3 className="text-cyan-400 font-medium text-base hover:underline">
            {project.name}
          </h3>
          <span className="text-xs px-2 py-0.5 border border-white/10 rounded-full text-white/40">
            {project.visibility}
          </span>
        </div>
      </div>

      {/* Fork indicator */}
      {project.forkedFrom && (
        <div className="flex items-center text-xs text-white/40 mb-2">
          <svg className="w-3 h-3 mr-1" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878z"/>
          </svg>
          Forked from <span className="text-cyan-400/70 ml-1">{project.forkedFrom}</span>
        </div>
      )}

      {/* Description */}
      <p className="text-white/50 text-sm mb-4 leading-relaxed font-light line-clamp-2">
        {project.description}
      </p>

      {/* Topics */}
      {project.topics && project.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.topics.slice(0, 4).map((topic, topicIndex) => (
            <span
              key={topicIndex}
              className="text-xs px-2 py-1 bg-cyan-500/10 text-cyan-400/80 rounded-full border border-cyan-500/20"
            >
              {topic}
            </span>
          ))}
          {project.topics.length > 4 && (
            <span className="text-xs px-2 py-1 text-white/30">
              +{project.topics.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Repository Stats */}
      <div className="flex items-center justify-between text-xs text-white/30">
        <div className="flex items-center space-x-4">
          {/* Language */}
          <div className="flex items-center space-x-1.5">
            <div 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: project.languageColor }}
            />
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

        <span>{project.updated}</span>
      </div>
    </motion.div>
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
      x: -50,
      opacity: 0
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div 
      ref={ref}
      variants={slideInVariants}
      initial="hidden"
      animate={controls}
      className="mb-6"
    >
      {/* Directory Header */}
      <div 
        className="flex items-center space-x-3 mb-3 cursor-pointer hover:bg-white/[0.03] p-3 rounded-xl transition-all duration-300 group"
        onClick={() => onToggle(categoryKey)}
      >
        <div className="text-cyan-400/60 group-hover:text-cyan-400 transition-colors">
          {isExpanded ? (
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
              <path d="M12.78 5.22a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0L3.22 6.28a.75.75 0 011.06-1.06L8 8.94l3.72-3.72a.75.75 0 011.06 0z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z"/>
            </svg>
          )}
        </div>
        <div className="w-5 h-5 text-cyan-400/60 group-hover:text-cyan-400 transition-colors">
          <svg viewBox="0 0 16 16" fill="currentColor">
            <path d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3H7.5a.25.25 0 01-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75z"/>
          </svg>
        </div>
        <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text font-mono text-base font-medium group-hover:from-white group-hover:to-cyan-300 transition-all duration-300">
          {category.name}
        </span>
        <span className="text-white/30 text-sm">({projects.length})</span>
      </div>

      {/* Directory Description */}
      {isExpanded && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="ml-12 mb-4"
        >
          <p className="text-white/30 text-sm italic font-light"># {category.description}</p>
        </motion.div>
      )}

      {/* Projects Grid */}
      <div 
        className={`ml-8 overflow-hidden transition-all duration-500 ease-out ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
          {projects.map((project, idx) => (
            <RepositoryCard key={project.name} project={project} index={idx} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const [expandedCategories, setExpandedCategories] = useState({
    research: true,
    mlExperiments: false,
    embedded: false,
    webDev: false,
    tools: false
  });

  const toggleCategory = (categoryKey) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  return (
    <div className="h-screen overflow-y-auto custom-scrollbar">
      <div className="min-h-screen px-4 sm:px-8 py-24 sm:py-32">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-thin text-white mb-4 tracking-tight">
              Projects
            </h1>
            <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-xl p-4 max-w-md mx-auto">
              <div className="font-mono text-sm text-white/70">
                <span className="text-cyan-400">will</span>
                <span className="text-white/40">@</span>
                <span className="text-blue-400">portfolio</span>
                <span className="text-white/40">:</span>
                <span className="text-purple-400">~/projects</span>
                <span className="text-white/40">$ </span>
                <span className="text-white">ls -la</span>
              </div>
            </div>
          </motion.div>

          {/* Project Categories */}
          <div className="space-y-2">
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
      </div>
    </div>
  );
};

export default Projects;
