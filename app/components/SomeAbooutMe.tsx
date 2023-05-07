import React from "react";

function SomeAboutMe() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="px-10 py-10 md:py-20">
        <h2 className="text-2xl font-medium tracking-wider text-black mb-5">
          Some
          <br />
          About
          <br />
          Me
        </h2>

        <div className="ml-10 space-y-10">
          <p className="text-justify leading-6">
            I&apos;m a Full Stack Developer and web designer, Over 5+ years of
            experience in developing web applications. I have in-depth knowledge
            of React for building seamless UIs, Express Js for creating APIs,
            and both MongoDB and Postgres for efficient database management.
          </p>
          <p className="text-justify leading-6">
            With my expertise, I can build full stack web applications on time
            and according to your specific requirements. I take pride in
            delivering clean, efficient, and scalable code that meets the
            highest standards.
          </p>
        </div>

        <div className="flex justify-between items-center mt-20 gap-10">
          <p>
            If you&apos;re looking for a reliable and efficient developer who
            can help you bring your ideas to life, I&apos;m the right person for
            the job.
          </p>
          <h2 className="text-2xl font-medium tracking-wider text-black text-right">
            What
            <br />
            Can
            <br />
            I Offer
            <br />
            You
          </h2>
        </div>
      </div>
    </div>
  );
}

export default SomeAboutMe;
