import React from "react";

function Skills() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="px-10 py-10 md:py-20">
        <h2 className="text-2xl font-medium tracking-wider text-black mb-5">
          Skills
        </h2>
        <div className="space-y-10">
          <div className="flex  flex-wrap justify-between items-center gap-10 md:gap-0">
            <div>HTML</div>
            <div>CSS</div>
            <div>TailwindCSS</div>
            <div>Javascript</div>
            <div>React</div>
            <div>Node.js</div>
          </div>
          <div className="flex items-center gap-10 md:gap-20">
            <div>MongoDB</div>
            <div>PostgreSQL</div>
          </div>
          <div className="flex items-center gap-10 md:gap-20">
            <div>Git</div>
            <div>Docker</div>
            <div>Figma</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Skills;
