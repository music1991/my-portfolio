export interface PortfolioItem {
  id: string;
  year: string;
  category: string;
  captures: string[];
  client?: string;
  alt?: string;
  titleKey: string;
  detailsKey: string;
  shortDescription: string;
  note: boolean;
  company?: string;
  technologies: string[];
  link?: string;
}

export const DATA: PortfolioItem[] = [
  {
    id: "teamsImprove",
    year: "2025",
    category: "",
    captures: ["/images/projects/project_01_1.png", "/images/projects/project_01_2.png", "/images/projects/project_01_3.png"],
    titleKey: "projects.items.teamsImprove.title",
    detailsKey: "projects.items.teamsImprove.details",
    shortDescription: "projects.items.teamsImprove.shortDescription",
    note: false,
    technologies: ["React", "TypeScript", "Next", "Node", "PostgreSQL", "Code generation con AI", "Vercel", "Neon Storage"]
  },
    {
    id: "speak",
    year: "2025",
    category: "",
    captures: ["/images/projects/project_08_1.png", "/images/projects/project_08_2.png", "/images/projects/project_08_3.png"],
    titleKey: "projects.items.speak.title",
    detailsKey: "projects.items.speak.details", 
    shortDescription: "projects.items.speak.shortDescription",
    note: false,
    technologies: ["React", "TypeScript", "Code generation con AI", "Vercel"],
    link: "https://listen-and-speak.vercel.app"
  },
  {
    id: "complianceAutomation",
    year: "2025",
    category: "",
    captures: ["/images/projects/project_02_1.png"],
    titleKey: "projects.items.complianceAutomation.title",
    detailsKey: "projects.items.complianceAutomation.details",
    shortDescription: "projects.items.complianceAutomation.shortDescription",
    note: true,
    company: "totalcoin",
    technologies: ["React", "TypeScript", "C#", "Figma",  "Bitbucket",  "SCRUM"]
  },
  {
    id: "productModernization",
    year: "2025",
    category: "",
    captures: ["/images/projects/project_03_1.png"],
    titleKey: "projects.items.productModernization.title",
    detailsKey: "projects.items.productModernization.details",
    shortDescription: "projects.items.productModernization.shortDescription",
    note: true,
    company: "totalcoin",
    technologies: ["React", "React Native", "TypeScript", "C#", "Figma",  "Bitbucket",  "SCRUM", "iOS", "Android", "SQL Server"]
  },
  {
    id: "prepaidCard",
    year: "2024",
    category: "",
    captures: ["/images/projects/project_04_1.png", "/images/projects/project_04_2.png", "/images/projects/project_04_3.png"],
    titleKey: "projects.items.prepaidCard.title",
    detailsKey: "projects.items.prepaidCard.details",
    shortDescription: "projects.items.prepaidCard.shortDescription",
    note: true,
    company: "totalcoin",
    technologies: ["React Native", "TypeScript", "C#", "Figma",  "Bitbucket",  "SCRUM", "iOS", "Android", "SQL Server"]
  },
  {
    id: "map",
    year: "",
    category: "",
    captures: ["/images/projects/project_05_1.png", "/images/projects/project_05_2.png"],
    titleKey: "projects.items.map.title",
    detailsKey: "projects.items.map.details",
    shortDescription: "projects.items.map.shortDescription",
    note: true,
    company: "FLASH Servicios Postales",
    technologies: ["JavaScript", "HTML", "CSS", "PHP",  "Google Maps API", "SQL Server"]
  },
    {
    id: "qr",
    year: "",
    category: "",
    captures: ["/images/projects/project_07_1.png", "/images/projects/project_07_2.png", "/images/projects/project_07_3.png"],
    titleKey: "projects.items.qr.title",
    detailsKey: "projects.items.qr.details",
    shortDescription: "projects.items.qr.shortDescription",
    note: true,
    company: "FLASH Servicios Postales",
    technologies: ["JavaScript", "HTML", "CSS", "PHP",  "Microsoft Excel", "SQL Server"]
  },
  // {
  //   id: "",
  //   year: "",
  //   category: "",
  //   captures: [""],
  //   titleKey: "projects.items. .title",
  //   detailsKey: "projects.items. .details",
  //   note: "projects.items. .note",
  //   technologies: [""]
  // },
];
