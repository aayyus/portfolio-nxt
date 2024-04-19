"use client";

import React from 'react';
import Title from './Title';
import { HoverEffect } from './UI/card-hover-effect';
import { SiReact,SiNextdotjs,SiHtml5,SiCss3, SiAppwrite, SiJavascript, SiBootstrap, SiTailwindcss, SiGithub, } from 'react-icons/si';

export default function Skills() {

    const skills=[
        {
            text:"React",
            Icon: SiReact,
        },
        {
            text:"Next Js",
            Icon: SiNextdotjs,
        },
        {
            text:"HTML",
            Icon: SiHtml5,
        },
        {
            text:"CSS",
            Icon: SiCss3,
        },
        {
            text:"Appwrite",
            Icon: SiAppwrite,
        },
        {
            text:"JavaScript",
            Icon: SiJavascript,
        },
        {
            text:"BootStrap",
            Icon: SiBootstrap,
        },
        {
            text:"Tailwind",
            Icon: SiTailwindcss,
        },
        {
            text:"GitHub",
            Icon: SiGithub,
        },
    ]
  return (
   <div className='max-w-5xl mx-auto px-8'>
    <Title text='Skills' className='flex flex-col items-center justify-center -rotate-4' />
 <HoverEffect items={skills}/>  
   </div>
  )
}
