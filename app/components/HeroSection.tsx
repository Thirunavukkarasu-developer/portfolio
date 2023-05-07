import React from "react";

function HeroSection() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center  px-10 py-10 md:py-20">
        <div className="order-2 mt-4 md:mt-0 md:order-1">
          <p className="text-2xl tracking-wider">
            My name is <strong>Thirunavukkarasu E</strong>
          </p>
          <div className="md:text-lg mt-2 tracking-wider">
            <span className="text-gray-500">I’m : </span>Web Developer And Web
            Designer <span></span>
          </div>
        </div>
        <div className="md:w-60 md:order-2 border border-black rounded overflow-hidden">
          <img
            src="/images/thiru_pic.png"
            alt="thiruna"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
