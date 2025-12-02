"use client";

import React from 'react';
import Title from './Title';
import { HoverEffect } from './UI/card-hover-effect';
import { SiReact,SiNextdotjs,SiHtml5,SiCss3, SiAppwrite, SiJavascript, SiBootstrap, SiTailwindcss, SiGithub,SiShopify,SiMeta } from 'react-icons/si';

export default function Skills() {

    const skills=[
        {
            text:"Shopify",
            Icon: SiShopify,
        },
        {
            text:"Meta",
            Icon: SiMeta,
        },
        
      
        {
            text:"JavaScript",
            Icon: SiJavascript,
        },
        
    ]
  return (
   <div className='max-w-5xl mx-auto px-8'>
    <Title text='Skills' className='flex flex-col items-center justify-center -rotate-4' />
 <HoverEffect items={skills}/>  
   </div>
  )
}
