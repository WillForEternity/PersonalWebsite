import XOXO from "../assets/projects/XOXO.jpg";
import RAG from "../assets/projects/RAG.jpg";
import DFF from "../assets/projects/DFF.jpg";
import Plane from "../assets/projects/Plane.jpg";
import RFID from "../assets/projects/RFID.jpg";
import Glasses from "../assets/projects/Glasses.jpg";
import Cards from "../assets/projects/Cards.jpg";

export const PROJECTS = [
    {
      title: "Binary Classifier in C from Scratch",
      date: "2023",
      image: XOXO,
      description: "Built mathematical structure for a feed-forward, fully-connected neural network in C. No libraries, no frameworks, no autograd, just math and connective tissue (memory allocation, matrix multiplication, forward and back prop, safe_malloc to prevent memory leaks, etc. done by hand).",
      technologies: ["C"]
    },
    {
      title: "RAG for Documents",
      date: "2022",
      image: RAG,
      description: "Simple Retrieval Augmented Generation using Langchain, llama 3.1 embeddings + chat pulled using Ollama, and Chroma db to store embeddings. Allows me to split and embed pdf documents and draw chunks of them to use as context in responses to user queries.",
      technologies: ["Python", "LangChain", "ChromaDB", "Ollama"]
    },
    {
      title: "Building Simple Digital Circuits",
      date: "2022",
      image: DFF,
      description: "Built a NAND-gate only, positive edge-driggered master-slave D flip-flop with 7-segment display and an 8:1 multiplexer using two 4:1 multiplexers using breadboard and logic gates to reinforce my learning. Used premade clock circuit.",
      technologies: ["Breadboard", "Logic Gates"]
    },
    {
      title: "Airplane Launcher",
      image: Plane,
      description: "Designed and built a self launching balsa wood propeller airplane system. Stepper motor wound the propellor's rubber band, servo motors held the airplane back until the propeller has been properly wound (another rubber band for launching the airplane).",
      technologies: ["Servo Motors", "Stepper Motor", "Arduino", "Breadboard"]
    },
    {
      title: "RFID NFC Security Tag Reader",
      image: RFID,
      description: "Used Arduino UNO, the RC522 module, NTAG213 NFC programmable tags, and wrote an Arduino script to allow only tags of specific IDs through. Learned some basic fundamentals of RFID and Near-Field Communication.",
      technologies: ["Arduino UNO", "RC522 module", "NTAG213"]
    },
    {
      title: "Laser-Cut Safety Glasses",
      date: "2022",
      image: Glasses,
      description: "Used laser cutter to machine acrylic into glasses, and bent using heat.",
      technologies: ["Laser Cutter"]
    },
    {
      title: "Playing-Card Holder",
      date: "2023",
      image: Cards,
      description: "Machined and made a card-deck holder out of bamboo, made for two decks (Bridge cards).",
      technologies: ["Table saw", "Belt sander", "Clamps"]
    }
  ];