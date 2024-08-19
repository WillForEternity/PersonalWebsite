import React, { useEffect } from 'react';
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import me from "../assets/me.png";

const Hero = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const textWithBorderStyle = {
    textShadow: '-1px -1px 0 #1f2937, 1px -1px 0 #1f2937, -1px 1px 0 #1f2937, 1px 1px 0 #1f2937',
  };

  return (
    <div ref={ref} className="py-28 lg:py-36 pt-32 lg:pt-40 relative z-10"> {/* Increased top padding */}
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="flex flex-col lg:flex-row items-center justify-between"
        >
          <div className="w-full lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
            <motion.h1 
              variants={itemVariants}
              className="text-6xl md:text-9xl font-thin tracking-tight text-white text-center lg:text-left"
              style={textWithBorderStyle}
            >
              Will Norden
            </motion.h1>
            <motion.span 
              variants={itemVariants}
              className="bg-gradient-to-r from-pink-300 via-slate-700 to-purple-700 bg-clip-text text-3xl md:text-3xl tracking-tight text-transparent font-light text-center lg:text-left block mt-4"
            >
              Aspiring deep learning scientist and hardware engineer
            </motion.span>
            <motion.p 
              variants={itemVariants}
              className="max-w-xl text-sm md:text-sm font-extralight tracking-tighter text-center lg:text-left mt-6 text-white"
            >
             --  -- 
            </motion.p>
            <motion.p 
              variants={itemVariants}
              className="max-w-xl text-sm md:text-sm font-extralight tracking-tighter text-center lg:text-left mt-6 text-white"
            >
              For AI, my main interests are in deep neural networks that can perceive the world as humans can by using different modalities (e.g. vision, language, etc.), as well as help us with simulation, design, and creation. I love working with them, studying their architecture, interpreting their behavior, aligning them towards our goals, and thinking about how to make them better. 
            </motion.p>
            <motion.p 
              variants={itemVariants}
              className="max-w-xl text-sm md:text-sm font-extralight tracking-tighter text-center lg:text-left mt-4 text-white"
            >
              For hardware engineering, I'm particularly invested in digital logic design and synthesis, especially for hardware that is specifically optimized for accelerating certain tasks (e.g. Training deep neural networks, allowing them to run on edge devices, allowing for faster networking, etc.), however I'd like to look more into analog design as well.
            </motion.p>
          </div>
          <motion.div 
            variants={imageVariants}
            className="w-full lg:w-1/2 flex justify-center lg:justify-end items-center mt-8 lg:mt-0"
          >
            <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] rounded-3xl overflow-hidden shadow-lg">
              <img
                src={me}
                alt="Will Norden"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
