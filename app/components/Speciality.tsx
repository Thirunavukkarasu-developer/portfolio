import React from "react";

function Speciality() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="px-10 py-10 md:py-20">
        <h2 className="text-2xl font-medium tracking-wider text-black mb-5">
          Speciality
        </h2>
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-y-10 md:gap-y-0 md:gap-x-10">
          <div className="flex-1">
            <div className="font-semibold mb-2">UI & UX Design</div>
            <p className="text-justify leading-6">
              Design is my favourite pastime. I work as a designer not only
              because it provides me financial stability, but mainly because I
              have a passion for it.
            </p>
          </div>
          <div className="flex-1">
            <div className="font-semibold mb-2">Front-end developer</div>
            <p className="text-justify leading-6">
              Another favourite thing of mine is frontend development. I make a
              website of any complexity for you and adapt it. I write clear code
              that is easy to work in the future
            </p>
          </div>
          <div className="flex-1">
            <div className="font-semibold mb-2"> Back-end developer</div>
            <p className="text-justify leading-6">
              And, I am a back-end Node.js developer, developing RESTful APIs,
              integrating third-party services, and optimizing database queries
              for better performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Speciality;
