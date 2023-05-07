import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import Skills from "./components/Skills";
import SomeAboutMe from "./components/SomeAbooutMe";
import Speciality from "./components/Speciality";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full">
        <HeroSection />
        <hr className="max-w-xs md:max-w-md lg:max-w-xl xl:max-w-3xl border-black" />
        <Speciality />
        <hr className="max-w-xs md:max-w-md lg:max-w-xl xl:max-w-3xl border-black" />
        <Skills />
        <hr className="max-w-xs md:max-w-md lg:max-w-xl xl:max-w-3xl border-black" />
        <SomeAboutMe />
        <hr className="max-w-xs md:max-w-md lg:max-w-xl xl:max-w-3xl border-black" />
        <Footer />
      </div>
    </main>
  );
}
