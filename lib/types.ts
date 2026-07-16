export type ImageAlign = "top" | "center" | "bottom" | "left" | "right";

export type Project = {
  id: string;
  title: string;
  tag: string;
  tech: string[];
  link: string;
  cover: string;
  /** object-position for the cover image; defaults to "top" when absent. */
  align?: ImageAlign;
};

export type Skill = {
  id: string;
  text: string;
  description: string;
  icon: string;
};
