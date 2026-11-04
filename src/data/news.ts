export interface NewsItem {
  name: string;
  date: string;
  /** Internal route or external URL with more information. */
  link?: string;
}

export const milestones: NewsItem[] = [
  {
    name: "Our paper TraVIS, which combines player tracking and video for football action spotting, is presented at MMSports '26 (ACM Multimedia 2026) in Rio de Janeiro!",
    date: "Nov 2026",
    link: "/publications/football",
  },
  {
    name: "My Master's thesis \"See It Before You Grab It: Deep Learning-based Action Anticipation in Basketball\" is now on arXiv.",
    date: "Dec 2025",
    link: "/publications/basketball",
  },
  {
    name: "I started a PhD in Artificial Intelligence at the University of Barcelona and the Computer Vision Center!",
    date: "Oct 2025",
  },
  {
    name: "I successfully defended my Master's thesis \"See It Before You Grab It: Deep Learning-based Action Anticipation in Basketball\" at the 12th Annual Catalan Meeting on Computer Vision (ACMCV).",
    date: "Sept 2025",
    link: "/publications/basketball",
  },
  {
    name: "\"Revealing hidden bioimaging information by isotropic depolarization filtering\" is published in Optics & Laser Technology.",
    date: "Apr 2025",
    link: "/publications/bioimaging",
  },
  {
    name: "After a great year working at SEAT, I started a Master's degree in Computer Vision.",
    date: "Sept 2024",
  },
  {
    name: "I started a new position as a Software Developer at SEAT.",
    date: "Sept 2023",
  },
  {
    name: "I obtained my Bachelor's degree in Physics at the Autonomous University of Barcelona (UAB).",
    date: "Sept 2023",
  },
  {
    name: "I successfully defended my Bachelor's thesis \"Automated biological tissue classification using polarimetric imaging techniques\" at the Autonomous University of Barcelona (UAB).",
    date: "Jul 2023",
  },
  {
    name: "I started a research internship at the Optics Group of the Autonomous University of Barcelona (UAB).",
    date: "Dec 2022",
  },
];
