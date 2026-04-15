import React from 'react'
import Title from './Title';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { DirectionAwareHover } from './UI/direction-aware-hover';
import { SiReact,SiNextdotjs,SiHtml5,SiCss3, SiAppwrite, SiJavascript, SiBootstrap, SiTailwindcss, SiGithub, SiShopify, } from 'react-icons/si';

export default function Projects() {

    const projects =[
         {
            title:"Lydian AU",
            tech:[SiJavascript,SiShopify],
            link:"https://lydian.au/",
            cover:"/project7.png",
            background:"bg-gray-500",
        },
        {
            title:"Wellness with Jess",
            tech:[SiJavascript,SiShopify],
            link:"https://lesswithjess.com.au/",
            cover:"/project8.png",
            background:"bg-gray-500",
        },
        {
            title:"Torbreck Vintners",
            tech:[SiJavascript,SiShopify],
            link:"https://torbreck.com/",
            cover:"/torbreck.png",
            background:"bg-gray-500",
        },
         {
            title:"Etikette Candles",
            tech:[SiJavascript,SiShopify],
            link:"https://etikettecandles.com/",
            cover:"/etikette.png",
            background:"bg-gray-500",
        },
        {
            title:"Neon Packaging",
            tech:[SiJavascript,SiShopify],
            link:"https://www.neonpackaging.com.au/",
            cover:"/neon.png",
            background:"bg-gray-500",
        },
         {
            title:"UNTD2",
            tech:[SiJavascript,SiShopify],
            link:"https://untd2.com/",
            cover:"/untd.png",
            background:"bg-gray-500",
        },
        {
            title:"Island Vibes",
            tech:[SiJavascript,SiShopify],
            link:"https://www.island-vibes.com.au/",
            cover:"/island.png",
            background:"bg-gray-500",
        },
        
        {
            title:"Dmerce",
            tech:[SiNextdotjs,SiCss3],
            link:"https://dmerce.vercel.app/",
            cover:"/project1.png",
            background:"bg-gray-500",
        },
        {
            title:"Merav Services",
            tech:[SiJavascript,SiHtml5,SiCss3,SiBootstrap],
            link:"https://www.meravservices.com.np/",
            cover:"/project2.png",
            background:"bg-gray-500",
        },
       

    ];
  return (
    <div className='py-10 p-5 sm:p-0'>
            <Title text='Projects' className='flex flex-col items-center justify-center rotate-4' />
        <div className='grid grid-cols-1 sm:grid-cols-3 pt-20 gap-5'>

            {projects.map((project,index)=>{
                return<Link href={project.link} key={index}>

                    <div className={cn("p-5 rounded-md h-90",project.background)}>
                        <DirectionAwareHover imageUrl={project.cover} className='w-100 space-y-5 cursor-pointer h-60'>
                            <div className='space-y-5'>
                            <h1 className='text-2xl font-bold'>{project.title}</h1>
                            <div className='flex items-center gap-5'>
                                {project.tech.map((Icon,index)=>{
                                    return <Icon className="w-8 h-8" key= {index}/>;
                                })}
                            </div>
                            </div>
                        </DirectionAwareHover>

                    </div>
                </Link>;
            })}
        </div>
    </div>
  )
}
