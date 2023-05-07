import React from "react";

function Skills() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="px-10 py-10 md:py-20">
        <h2 className="text-2xl font-medium tracking-wider text-black mb-5">
          Skills
        </h2>
        <div className="space-y-10">
          <ul className="flex  flex-wrap justify-between items-center gap-10 md:gap-0">
            <li>HTML</li>
            <li>CSS</li>
            <li>TailwindCSS</li>
            <li>Javascript</li>
            <li>React</li>
            <li>Node.js</li>
          </ul>
          <ul className="flex items-center gap-10 md:gap-20">
            <li>MongoDB</li>
            <li>PostgreSQL</li>
          </ul>
          <ul className="flex items-center gap-10 md:gap-20">
            <li>Git</li>
            <li>Docker</li>
            <li>Figma</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Skills;
