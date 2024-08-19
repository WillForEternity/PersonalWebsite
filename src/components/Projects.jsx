import React from 'react';
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { PROJECTS } from "../constants";

const ProjectItem = ({ project, index }) => {
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

  const slideInVariants = {
    hidden: { 
      x: index % 2 === 0 ? -100 : 100,
      opacity: 0
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
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
      className="mb-8 flex flex-col lg:flex-row lg:justify-center"
    >
      <div className="w-full lg:w-1/4 flex justify-center lg:justify-start mb-6 lg:mb-0"> 
        <img 
          src={project.image} 
          width={200} 
          height={200} 
          alt={project.title} 
          className="rounded object-cover w-full max-w-[200px] h-auto"
        />
      </div>
      <div className="w-full lg:w-3/4 max-w-xl">
        <h6 className="mb-2 font-bold text-center lg:text-left">
          {project.title}
        </h6>
        <p className="mb-4 text-neutral-400 text-center lg:text-left">
          {project.description}
        </p>
        <div className="flex flex-wrap justify-center lg:justify-start">
          {project.technologies.map((tech, techIndex) => (
            <span
              key={techIndex}
              className="mr-2 mb-2 rounded bg-neutral-900 px-2 py-1 text-sm font-medium text-purple-900"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
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

  return (
    <div className="border-b border-neutral-900 pb-4">
      <motion.h1
        ref={ref}
        variants={titleVariants}
        initial="hidden"
        animate={controls}
        className="my-20 text-center text-4xl"
      >
        Projects
      </motion.h1>
      <div>
        {PROJECTS.map((project, index) => (
          <ProjectItem key={index} project={project} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Projects;