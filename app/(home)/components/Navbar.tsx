import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { CiInstagram } from "react-icons/ci";
import { SiGithub } from "react-icons/si";
import { SlSocialLinkedin } from "react-icons/sl";
export default function navbar({className}:{className?:string}) {
  const socials = [
    {
      Link: "https://www.linkedin.com",
      Label: "Linkedin",
      Icon: SlSocialLinkedin,
    },
    {
      Link: "https://www.linkedin.com",
      Label: "Github",
      Icon: SiGithub,
    },
    {
      Link: "https://www.linkedin.com",
      Label: "insta",
      Icon: CiInstagram,
    },
  ];

  return (
    <nav className={cn("py-10 flex justify-between items-center animate-move-down",className)}> 
      <h1 className="text-2xl font-bold ">Aayush Sharma</h1> 
      <i data-lucide="map-pin-off"></i>
      
      <div className="flex items-center gap-5">
      
        {socials.map((social, index) => {
          const Icon = social.Icon;

          return (
            <Link
              href={social.Link}
              key={index}
              aria-label={social.Label}
              target="_blank"
            >
              <Icon className="w-5 h-5 hover:scale-125 transition-all" />

            </Link>
            
          );
        })}
      </div>
    </nav>
  );
}