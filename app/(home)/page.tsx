import React from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Footer from "./components/Footer";

export default function page() {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <div className=" dark:bg-black bg-white  dark:bg-dot-white/[0.15] bg-dot-black/[0.15] ">
        <div className="max-w-7xl mx-auto p-5 mb-10">
          <Navbar />
          <HeroSection />
        </div>
        <div className="h-10 xl:h-32 bg-gradient-to-t from-black absolute -bottom-5 left-0 xl:bottom-0 w-full "></div>{" "}
        <div className="max-w-7xl mx-auto p-5 mt-30">
          <Skills />
          <Projects/>
          <Footer/>
          
        </div>
      </div>
    </div>
  );
}
