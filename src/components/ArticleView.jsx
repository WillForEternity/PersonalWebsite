import React from 'react';
import { motion } from 'framer-motion';

// Simple markdown-like parser for basic formatting
const parseMarkdown = (text) => {
  if (!text) return [];
  
  const elements = [];
  const lines = text.split('\n');
  let currentParagraph = [];
  let inCodeBlock = false;
  let codeBlockContent = [];
  let codeBlockLang = '';
  
  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const content = currentParagraph.join(' ').trim();
      if (content) {
        elements.push({ type: 'paragraph', content });
      }
      currentParagraph = [];
    }
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Code block start/end
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        flushParagraph();
        inCodeBlock = true;
        codeBlockLang = line.trim().slice(3);
        codeBlockContent = [];
      } else {
        elements.push({ type: 'codeblock', content: codeBlockContent.join('\n'), lang: codeBlockLang });
        inCodeBlock = false;
        codeBlockContent = [];
        codeBlockLang = '';
      }
      continue;
    }
    
    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }
    
    // Headers
    if (line.startsWith('### ')) {
      flushParagraph();
      elements.push({ type: 'h3', content: line.slice(4) });
      continue;
    }
    if (line.startsWith('## ')) {
      flushParagraph();
      elements.push({ type: 'h2', content: line.slice(3) });
      continue;
    }
    if (line.startsWith('# ')) {
      flushParagraph();
      elements.push({ type: 'h1', content: line.slice(2) });
      continue;
    }
    
    // Horizontal rule
    if (line.trim() === '---' || line.trim() === '***') {
      flushParagraph();
      elements.push({ type: 'hr' });
      continue;
    }
    
    // Blockquote
    if (line.startsWith('> ')) {
      flushParagraph();
      elements.push({ type: 'blockquote', content: line.slice(2) });
      continue;
    }
    
    // Image: ![alt](src)
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      flushParagraph();
      elements.push({ type: 'image', alt: imgMatch[1], src: imgMatch[2] });
      continue;
    }
    
    // Unordered list item
    if (line.match(/^[\-\*]\s/)) {
      flushParagraph();
      elements.push({ type: 'li', content: line.slice(2) });
      continue;
    }
    
    // Numbered list item
    const olMatch = line.match(/^(\d+)\.\s(.+)$/);
    if (olMatch) {
      flushParagraph();
      elements.push({ type: 'oli', number: olMatch[1], content: olMatch[2] });
      continue;
    }
    
    // Empty line = paragraph break
    if (line.trim() === '') {
      flushParagraph();
      continue;
    }
    
    // Regular text
    currentParagraph.push(line);
  }
  
  flushParagraph();
  
  return elements;
};

// Render inline formatting (bold, italic, code, links)
const renderInline = (text) => {
  if (!text) return null;
  
  const parts = [];
  let remaining = text;
  let key = 0;
  
  while (remaining.length > 0) {
    // Bold: **text** or __text__
    let match = remaining.match(/^(.*?)(\*\*|__)(.+?)\2(.*)$/s);
    if (match) {
      if (match[1]) parts.push(<span key={key++}>{match[1]}</span>);
      parts.push(<strong key={key++} className="font-semibold text-white">{renderInline(match[3])}</strong>);
      remaining = match[4];
      continue;
    }
    
    // Italic: *text* or _text_
    match = remaining.match(/^(.*?)(\*|_)([^*_]+)\2(.*)$/s);
    if (match) {
      if (match[1]) parts.push(<span key={key++}>{match[1]}</span>);
      parts.push(<em key={key++} className="italic text-white/80">{renderInline(match[3])}</em>);
      remaining = match[4];
      continue;
    }
    
    // Inline code: `code`
    match = remaining.match(/^(.*?)`([^`]+)`(.*)$/s);
    if (match) {
      if (match[1]) parts.push(<span key={key++}>{match[1]}</span>);
      parts.push(
        <code key={key++} className="px-1.5 py-0.5 bg-white/10 rounded text-cyan-300 font-mono text-[0.9em]">
          {match[2]}
        </code>
      );
      remaining = match[3];
      continue;
    }
    
    // Link: [text](url)
    match = remaining.match(/^(.*?)\[([^\]]+)\]\(([^)]+)\)(.*)$/s);
    if (match) {
      if (match[1]) parts.push(<span key={key++}>{match[1]}</span>);
      parts.push(
        <a 
          key={key++} 
          href={match[3]} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
        >
          {match[2]}
        </a>
      );
      remaining = match[4];
      continue;
    }
    
    // No more matches, push remaining text
    parts.push(<span key={key++}>{remaining}</span>);
    break;
  }
  
  return parts.length === 1 ? parts[0] : parts;
};

const ArticleView = ({ article, onBack }) => {
  const elements = parseMarkdown(article.content);
  
  return (
    <div className="min-h-screen relative z-10">
      {/* Article content */}
      <div className="px-4 sm:px-8 pt-24 sm:pt-28 pb-20 sm:pb-32">
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-3xl mx-auto"
        >
          {/* Article header */}
          <header className="mb-12 sm:mb-16">
            {/* Meta */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm text-cyan-400 font-mono">{article.date}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="text-sm text-white/40">{article.readTime}</span>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-white leading-tight tracking-tight mb-6">
              {article.title}
            </h1>
            
            {/* Decorative line */}
            <div className="w-16 h-px bg-gradient-to-r from-cyan-500 to-transparent" />
          </header>
          
          {/* Article body */}
          <div className="article-prose">
            {elements.map((el, idx) => {
              switch (el.type) {
                case 'h1':
                  return (
                    <h2 key={idx} className="text-2xl sm:text-3xl font-light text-white mt-12 mb-6">
                      {renderInline(el.content)}
                    </h2>
                  );
                case 'h2':
                  return (
                    <h3 key={idx} className="text-xl sm:text-2xl font-light text-white mt-10 mb-5">
                      {renderInline(el.content)}
                    </h3>
                  );
                case 'h3':
                  return (
                    <h4 key={idx} className="text-lg sm:text-xl font-medium text-white/90 mt-8 mb-4">
                      {renderInline(el.content)}
                    </h4>
                  );
                case 'paragraph':
                  return (
                    <p key={idx} className="text-base sm:text-lg text-white/70 font-light leading-relaxed sm:leading-loose mb-6">
                      {renderInline(el.content)}
                    </p>
                  );
                case 'blockquote':
                  return (
                    <blockquote key={idx} className="border-l-2 border-cyan-500/50 pl-6 my-8 text-white/60 italic">
                      <p className="text-base sm:text-lg leading-relaxed">
                        {renderInline(el.content)}
                      </p>
                    </blockquote>
                  );
                case 'codeblock':
                  return (
                    <pre key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 my-8 overflow-x-auto">
                      <code className="text-sm text-cyan-300 font-mono leading-relaxed">
                        {el.content}
                      </code>
                    </pre>
                  );
                case 'image':
                  return (
                    <figure key={idx} className="my-10 sm:my-12">
                      <div className="rounded-xl overflow-hidden border border-white/10">
                        <img 
                          src={el.src} 
                          alt={el.alt} 
                          className="w-full h-auto"
                          loading="lazy"
                        />
                      </div>
                      {el.alt && (
                        <figcaption className="text-center text-sm text-white/40 mt-4 font-light">
                          {el.alt}
                        </figcaption>
                      )}
                    </figure>
                  );
                case 'hr':
                  return (
                    <hr key={idx} className="border-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-12" />
                  );
                case 'li':
                  return (
                    <div key={idx} className="flex gap-3 mb-3">
                      <span className="text-cyan-400 mt-1.5">•</span>
                      <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed">
                        {renderInline(el.content)}
                      </p>
                    </div>
                  );
                case 'oli':
                  return (
                    <div key={idx} className="flex gap-3 mb-3">
                      <span className="text-cyan-400 font-mono text-sm mt-1">{el.number}.</span>
                      <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed">
                        {renderInline(el.content)}
                      </p>
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
          
          <div className="mt-16 sm:mt-20 pt-8 border-t border-white/10" />
        </motion.article>
      </div>
    </div>
  );
};

export default ArticleView;
