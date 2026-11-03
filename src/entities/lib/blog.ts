/**
 * Blog posts ("Sobre Ingeniería"). Metadata lives here; the texts (title, excerpt, body)
 * live in the locales under blog.posts.<id>, so every post exists in both languages.
 * The current posts are placeholders: replace them with real ones as they get written.
 */

export type BlogCategory = "architecture" | "ai" | "frontend" | "practice";

export interface BlogPost {
  id: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  readMinutes: number;
  category: BlogCategory;
  tags: string[];
  featured?: boolean;
}

export const BLOG_CATEGORIES: BlogCategory[] = ["architecture", "ai", "frontend", "practice"];

export const BLOG_POSTS: BlogPost[] = [
  { id: "agents-spec-driven", date: "2026-10-28", readMinutes: 7, category: "ai", tags: ["AI Agents", "SDD"], featured: true },
  { id: "rag-in-production", date: "2026-10-12", readMinutes: 9, category: "ai", tags: ["RAG", "LLM"] },
  { id: "clean-architecture-react", date: "2026-09-30", readMinutes: 8, category: "architecture", tags: ["React", "Clean Architecture"] },
  { id: "from-idea-to-mvp", date: "2026-09-15", readMinutes: 6, category: "practice", tags: ["MVP", "Product"] },
  { id: "react-native-performance", date: "2026-08-27", readMinutes: 7, category: "frontend", tags: ["React Native", "Performance"] },
  { id: "monolith-first", date: "2026-08-10", readMinutes: 6, category: "architecture", tags: ["Microservices", "Node.js"] },
  { id: "ai-adoption-teams", date: "2026-07-22", readMinutes: 5, category: "ai", tags: ["GenAI", "Teams"] },
  { id: "design-systems-tokens", date: "2026-07-05", readMinutes: 5, category: "frontend", tags: ["Design Systems", "Tailwind"] },
  { id: "code-review-culture", date: "2026-06-18", readMinutes: 4, category: "practice", tags: ["Code Review", "Teams"] },
];
