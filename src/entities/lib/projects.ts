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
    id: "ecommerce",
    year: "2026",
    category: "",
    captures: ["/images/projects/project_13_1.webp", "/images/projects/project_13_5.webp", "/images/projects/project_13_3.webp", "/images/projects/project_13_4.webp", "/images/projects/project_13_2.webp", "/images/projects/project_13_6.webp", "/images/projects/project_13_7.webp"],
    titleKey: "projects.items.ecommerce.title",
    detailsKey: "projects.items.ecommerce.details",
    shortDescription: "projects.items.ecommerce.shortDescription",
    note: false,
    technologies: ["React", "TypeScript","Vercel", "SQL Server", "Laravel", "AI code generation"],
    link: "https://ecommerce.24studio.net"
  },
  {
    id: "pwa",
    year: "2025",
    category: "",
    captures: ["/images/projects/project_14_4.webp", "/images/projects/project_14_3.webp", "/images/projects/project_14_2.webp", "/images/projects/project_14_1.webp"],
    titleKey: "projects.items.pwa.title",
    detailsKey: "projects.items.pwa.details",
    shortDescription: "projects.items.pwa.shortDescription",
    note: false,
    technologies: ["React", "TypeScript", "Vercel"],
    link: "https://shared-pwa-frontend.vercel.app"
  },
  {
    id: "24Studio",
    year: "2026",
    category: "",
    captures: ["/images/projects/project_12_4.webp", "/images/projects/project_12_5.webp", "/images/projects/project_12_2.webp", "/images/projects/project_12_3.webp", "/images/projects/project_12_1.webp", ],
    titleKey: "projects.items.24Studio.title",
    detailsKey: "projects.items.24Studio.details",
    shortDescription: "projects.items.24Studio.shortDescription",
    note: false,
    technologies: ["React", "TypeScript","Vercel"],
    link: "https://24studio.net"
  },
  {
    id: "teamsImprove",
    year: "2025",
    category: "",
    captures: ["/images/projects/project_01_1.webp"],
    titleKey: "projects.items.teamsImprove.title",
    detailsKey: "projects.items.teamsImprove.details",
    shortDescription: "projects.items.teamsImprove.shortDescription",
    note: false,
    technologies: ["React", "TypeScript", "Next", "Node", "PostgreSQL", "Code generation con AI", "Vercel", "Neon Storage"],
    link: "https://auth-app-demo-delta.vercel.app/login"
  },
    {
    id: "speak",
    year: "2025",
    category: "",
    captures: ["/images/projects/project_08_1.webp", "/images/projects/project_08_2.webp", "/images/projects/project_08_3.webp"],
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
    captures: ["/images/projects/project_02_1.webp"],
    titleKey: "projects.items.complianceAutomation.title",
    detailsKey: "projects.items.complianceAutomation.details",
    shortDescription: "projects.items.complianceAutomation.shortDescription",
    note: true,
    company: "totalcoin",
    technologies: ["React", "TypeScript", "C#", "Figma",  "Bitbucket",  "SCRUM"]
  },
  {
    id: "productModernizationweb",
    year: "2025",
    category: "",
    captures: ["/images/projects/project_11_1.webp", "/images/projects/project_11_2.webp"],
    titleKey: "projects.items.productModernizationweb.title",
    detailsKey: "projects.items.productModernizationweb.details",
    shortDescription: "projects.items.productModernizationweb.shortDescription",
    note: true,
    company: "totalcoin",
    technologies: ["React", "TypeScript", "C#", "Figma",  "Bitbucket",  "SCRUM", "SQL Server"]
  },
    {
    id: "productModernizationapp",
    year: "2025",
    category: "",
    captures: ["/images/projects/project_10_1.webp", "/images/projects/project_10_2.webp"],
    titleKey: "projects.items.productModernizationapp.title",
    detailsKey: "projects.items.productModernizationapp.details",
    shortDescription: "projects.items.productModernizationapp.shortDescription",
    note: true,
    company: "totalcoin",
    technologies: ["React Native", "TypeScript", "C#", "Figma",  "Bitbucket",  "SCRUM", "iOS", "Android", "SQL Server"]
  },
  {
    id: "prepaidCard",
    year: "2024",
    category: "",
    captures: ["/images/projects/project_04_1.webp", "/images/projects/project_04_2.webp", "/images/projects/project_04_3.webp"],
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
    captures: ["/images/projects/project_05_1.webp", "/images/projects/project_05_2.webp"],
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
    captures: ["/images/projects/project_07_1.webp", "/images/projects/project_07_2.webp", "/images/projects/project_07_3.webp"],
    titleKey: "projects.items.qr.title",
    detailsKey: "projects.items.qr.details",
    shortDescription: "projects.items.qr.shortDescription",
    note: true,
    company: "FLASH Servicios Postales",
    technologies: ["JavaScript", "HTML", "CSS", "PHP",  "Microsoft Excel", "SQL Server"]
  },
  {
    id: "automated",
    year: "2025",
    category: "",
    captures: ["/images/projects/project_09_1.webp", "/images/projects/project_09_2.webp"],
    titleKey: "projects.items.automated.title",
    detailsKey: "projects.items.automated.details",
    shortDescription: "projects.items.automated.shortDescription",
    note: false,
    technologies: ["JavaScript", "HTML", "CSS", "PHP",  "Microsoft Excel", "SQL Server"]
  },
];
