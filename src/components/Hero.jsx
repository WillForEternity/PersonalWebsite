import React from 'react';
import { motion } from "framer-motion";
import me from "../assets/me.png";

const Hero = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, x: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative z-10 px-4 sm:px-8 pt-20">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16"
        >
          {/* Text Content */}
          <div className="w-full lg:w-1/2 lg:pr-8">
            <motion.h1 
              variants={itemVariants}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-thin tracking-tight text-white text-center lg:text-left leading-none"
              style={{
                textShadow: '-1px -1px 0 rgba(31, 41, 55, 0.5), 1px -1px 0 rgba(31, 41, 55, 0.5), -1px 1px 0 rgba(31, 41, 55, 0.5), 1px 1px 0 rgba(31, 41, 55, 0.5)'
              }}
            >
              Will Norden
            </motion.h1>
            
            <motion.div 
              variants={itemVariants}
              className="mt-6 text-center lg:text-left"
            >
              <span className="text-xl sm:text-2xl md:text-3xl tracking-tight font-light">
                <span className="text-transparent bg-gradient-to-r from-blue-400 via-white to-cyan-400 bg-clip-text">
                  Aspiring AI scientist and hardware engineer
                </span>
              </span>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="mt-2 text-center lg:text-left"
            >
              <span className="text-white/30 font-mono text-sm">— —</span>
            </motion.div>
            
            <motion.p 
              variants={itemVariants}
              className="max-w-xl text-sm md:text-base font-extralight tracking-tight text-center lg:text-left mt-8 text-white/90 leading-relaxed"
            >
              Bridging rigorous inquiry through research and shipping quality systems through engineering. Previous work has been centered around deep reinforcement learning, embedded systems, neuromorphic computing, and hardware design.
            </motion.p>
            
            <motion.p 
              variants={itemVariants}
              className="max-w-xl text-sm md:text-base font-extralight tracking-tight text-center lg:text-left mt-5 text-white/90 leading-relaxed"
            >
              Seeking to become an expert in Deep Reinforcement Learning (RL) and to apply this knowledge to chip design, robotics, and more, applying SoTA techniques while also developing novel algorithms and optimizers.            </motion.p>

            <motion.p 
              variants={itemVariants}
              className="max-w-xl text-sm md:text-base font-extralight tracking-tight text-center lg:text-left mt-5 text-white/90 leading-relaxed"
            >
              For computer hardware engineering, I'm particularly interested in designing hardware optimized for AI, and using AI to optimize the design of hardware. Working to blend deep reinforcement learning and natural language processing techniques to build AI digital logic-design agents.
            </motion.p>
          </div>

          {/* Image */}
          <motion.div 
            variants={imageVariants}
            className="w-full lg:w-1/2 flex justify-center lg:justify-end items-center"
          >
            <div className="relative group">
              {/* Decorative elements */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[26rem] xl:h-[26rem] rounded-3xl overflow-hidden ring-1 ring-white/10">
                <img
                  src={me}
                  alt="Will Norden"
                  className="w-full h-full object-cover"
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/30 to-transparent" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
