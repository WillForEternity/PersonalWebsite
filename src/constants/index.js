export const PROJECT_CATEGORIES = {
  research: {
    name: "research/",
    description: "Academic & professional research projects"
  },
  mlExperiments: {
    name: "ml-experiments/",
    description: "Machine learning implementations & experiments"
  },
  embedded: {
    name: "embedded/",
    description: "Hardware & firmware projects"
  },
  webDev: {
    name: "web-dev/",
    description: "Full-stack applications & simulations"
  },
  tools: {
    name: "tools/",
    description: "Utility applications & solvers"
  }
};

export const PROJECTS = {
  research: [
    {
      name: "DeepRune",
      visibility: "Public",
      forkedFrom: "google-research/circuit_training",
      description: "Fork of Google's AlphaChip that I hope to advance architecturally (distributed RL for VLSI Floorplanning).",
      language: "Python",
      languageColor: "#3776ab",
      stars: 0,
      forks: 0,
      updated: "2025",
      githubUrl: "https://github.com/WillForEternity/DeepRune",
      topics: ["reinforcement-learning", "vlsi", "chip-design", "graph-neural-networks"]
    },
    {
      name: "MultiSim",
      visibility: "Public",
      description: "Neural network + physics-based simulation for allowing wheeled quadrupeds to learn how to navigate a dynamic obstacle course using an actor–critic reinforcement learning algorithm.",
      language: "C++",
      languageColor: "#f34b7d",
      stars: 0,
      forks: 0,
      updated: "2025",
      githubUrl: "https://github.com/WillForEternity/MultiSim",
      topics: ["reinforcement-learning", "physics-simulation", "robotics", "cpp"]
    },
    {
      name: "MemoryCapacitorTopologies",
      visibility: "Public",
      description: "Comprehensive, modular, extensible, and user-friendly framework for creating, testing, and deploying memcapacitor-based neuromorphic computing models. PyTorch-native and automated for remote-access...",
      language: "Python",
      languageColor: "#3776ab",
      stars: 0,
      forks: 0,
      updated: "2025",
      githubUrl: "https://github.com/WillForEternity/MemoryCapacitorTopologies",
      topics: ["neuromorphic-computing", "pytorch", "memristors", "reservoir-computing"]
    }
  ],
  mlExperiments: [
    {
      name: "MNIST.c",
      visibility: "Public",
      description: "Neural network in C that classifies digits from the MNIST dataset. Allows users to draw digits, classify them, and further train the network on these samples. Data from both the most recent batch, ...",
      language: "C",
      languageColor: "#555555",
      stars: 0,
      forks: 0,
      updated: "2024",
      githubUrl: "https://github.com/WillForEternity/MNIST.c",
      topics: ["neural-networks", "mnist", "c", "machine-learning", "from-scratch"]
    },
    {
      name: "echo-state-networks",
      visibility: "Public",
      description: "Echo-State RNN vs. Traditional RNN for Chaotic Time-Series Prediction. Implemented multi-reservoir echo-state RNN and traditional RNN for prediction on the classic chaotic Lorenz system.",
      language: "Python",
      languageColor: "#3776ab",
      stars: 0,
      forks: 0,
      updated: "2025",
      githubUrl: "#",
      topics: ["rnn", "time-series", "reservoir-computing", "chaos-theory"]
    },
    {
      name: "gpt2-recreation",
      visibility: "Public",
      description: "GPT-2 implementation from scratch following Andrej Karpathy's guidance. Built to understand transformer architecture and attention mechanisms at a fundamental level.",
      language: "Python",
      languageColor: "#3776ab",
      stars: 0,
      forks: 0,
      updated: "2024",
      githubUrl: "#",
      topics: ["gpt", "transformers", "nlp", "pytorch"]
    }
  ],
  embedded: [
    {
      name: "STM32F4_BLDC_PWM",
      visibility: "Public",
      description: "Force sensitive PWM throttle system for brushless DC motor control. Utilizes 2 force sensitive resistors and the STM32F4 Microcontroller's ADC functionality to generate a 50Hz PWM signal and modula...",
      language: "C",
      languageColor: "#555555",
      stars: 0,
      forks: 0,
      updated: "2024",
      githubUrl: "https://github.com/WillForEternity/STM32F4_BLDC_PWM",
      topics: ["stm32", "embedded", "motor-control", "pwm", "sensors"]
    },
    {
      name: "renesas-rl-system",
      visibility: "Private",
      description: "Industrial embedded AI system for real-time reinforcement learning on Renesas RA8D1 microcontroller. Implemented LoRA fine-tuning, AWQ quantization, and temporal CNN from scratch in C.",
      language: "C",
      languageColor: "#555555",
      stars: 0,
      forks: 0,
      updated: "2025",
      githubUrl: "#",
      topics: ["renesas", "embedded-ai", "reinforcement-learning", "quantization"]
    }
  ],
  webDev: [
    {
      name: "PersonalWebsite",
      visibility: "Public",
      description: "Personal portfolio website built with React and Vite. Features responsive design, smooth animations, and showcases my projects and research work.",
      language: "JavaScript",
      languageColor: "#f1e05a",
      stars: 0,
      forks: 0,
      updated: "2025",
      githubUrl: "https://github.com/WillForEternity/PersonalWebsite",
      topics: ["react", "portfolio", "vite", "tailwindcss"]
    },
    {
      name: "UnderwaterBiomeSim",
      visibility: "Public",
      description: "Decently complex underwater biome simulation with shoaling blue fish and red predators that chase them around.",
      language: "JavaScript",
      languageColor: "#f1e05a",
      stars: 0,
      forks: 0,
      updated: "2023",
      githubUrl: "https://github.com/WillForEternity/UnderwaterBiomeSim",
      topics: ["simulation", "predator-prey", "javascript", "canvas"]
    }
  ],
  tools: [
    {
      name: "complex-matrix-solver",
      visibility: "Public",
      description: "Calculation tool to solve complex-valued matrix equations Ax=b, where A is an n by n matrix. Outputs solved vector x, as well as steady-state equations in cartesian and polar form.",
      language: "Python",
      languageColor: "#3776ab",
      stars: 0,
      forks: 0,
      updated: "2024",
      githubUrl: "#",
      topics: ["linear-algebra", "complex-numbers", "circuit-analysis", "mathematics"]
    }
  ]
};