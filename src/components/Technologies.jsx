import React from 'react';
import { motion } from 'framer-motion';

// Import your SVG files
import CProgramming from '../assets/icons/c.svg';
import Python from '../assets/icons/python.svg';
import Gemini from '../assets/icons/google-gemini.svg';
import PyTorch from '../assets/icons/pytorch.svg';
import Numpy from '../assets/icons/numpy.svg';
import ReactIcon from '../assets/icons/react.svg';
import Claude from '../assets/icons/claude-icon.svg';
import Javascript from '../assets/icons/javascript.svg';
import Openai from '../assets/icons/openai-icon.svg';
import Raspberry from '../assets/icons/raspberry-pi.svg';
import Renesas from '../assets/icons/Renesas_Electronics_logo.svg';
import Nvidia from '../assets/icons/nvidia.svg';

const TechItem = ({ icon: Icon, invert }) => {
  const bobFrequency = Math.random() * 0.5 + 0.5; // Random frequency between 0.5 and 1
  
  return (
    <motion.div
      className="m-2"
      animate={{ y: [-5, 5, -5] }}
      transition={{
        duration: bobFrequency * 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <img 
        src={Icon} 
        alt="" 
        className={`w-12 h-12 object-contain ${invert ? 'invert' : ''}`}
      />
    </motion.div>
  );
};

const TechSection = ({ title, items }) => {
  return (
    <div className="flex-1 min-w-0 px-4">
      <h3 className="text-xl font-light mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-900">
        {title}
      </h3>
      <div className="flex flex-wrap justify-center">
        {items.map((item, index) => (
          <TechItem key={index} icon={item.icon} invert={item.invert} />
        ))}
      </div>
    </div>
  );
};

const Technologies = () => {
  const techSections = [
    {
      title: "Languages",
      items: [
        { icon: CProgramming, invert: true },
        { icon: Python, invert: true },
        { icon: Javascript, invert: true }
      ]
    },
    {
      title: "Frameworks/Technologies",
      items: [
        { icon: PyTorch, invert: true },
        { icon: Numpy, invert: false },
        { icon: ReactIcon, invert: false },
      ]
    },
    {
      title: "Models",
      items: [
        { icon: Claude, invert: true },
        { icon: Openai, invert: true },
        { icon: Gemini, invert: false },
      ]
    },
    {
        title: "Hardware",
        items: [
          { icon: Raspberry, invert: false },
          { icon: Renesas, invert: false },
          { icon: Nvidia, invert: true },
        ]
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h2 className="text-3xl font-light text-center mb-8 tracking-tight text-white">
        Technologies I've Built With:
      </h2>
      <div className="bg-gray-800 bg-opacity-30 backdrop-blur-sm rounded-lg shadow-lg p-6">
        <div className="flex flex-wrap -mx-6">
          {techSections.map((section, index) => (
            <TechSection key={index} title={section.title} items={section.items} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Technologies;