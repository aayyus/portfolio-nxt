import Link from "next/link";
import React from "react";
import { SiMaildotru } from "react-icons/si";
import { MovingBorderBtn } from "./UI/moving-border";
import Title from "./Title";

export default function HeroSection() {
  return (
    <div className="min-h-[60vh] flex flex-col-reverse gap-14 lg:gap-0 lg:flex-row items-center justify-between animation-move-up">
      <div className="space-y-10 text-center lg:text-left ">
        <h1 className="text-4xl lg:text-7xl font-bold">
          Hi I am <br />
          <span className="underline underline-offset-4 decoration-purple-500">
            {"Aayush."}{" "}
          </span>
        </h1>
        <p className="md:w-96 text-lg text-gray-300">
          A web developer with a passion for learning and creating.
        </p>

        <Link
          href={"mailto:aayushat902@gmail.com"}
          className="inline-block group"
        >
          <Title text={"Contact Me"}  className=" text-center"/>
        </Link>
      </div>
      <div className="relative">
        <div className="w-72 h-72 space-y-3 rotate-[60deg] py-10 relative">
          <div className="flex gap-3 translate-x-8 ">
            <div className="w-32 h-32 rounded-2xl bg-yellow-500 hover:rotate-45 transition-all"></div>
            <div className="w-32 h-32 rounded-3xl bg-purple-500 rotate-45 hover:rotate-90 transition-all"></div>
          </div>
          <div className="flex gap-3 -translate-x-8 ">
            <div className="w-32 h-32 rounded-3xl bg-purple-500 rotate-45 hover:rotate-90 transition-all"></div>

            <div className="w-32 h-32 rounded-2xl bg-yellow-500 hover:rotate-45 transition-all"></div>
          </div>
          <div className="glow absolute top-[50%] right-[50%] -z-10"></div>
        </div>
        <div className="absolute bottom-5 sm:bottom-14 left-0 sm:-left-10">
          <MovingBorderBtn borderRadius="0.5rem" className="p-3  font-semibold">
            <p>Open to Work</p>
          </MovingBorderBtn>
        </div>
      </div>
    </div>
  );
}
