import { BrainCircuit, Building2, DatabaseZap, MessageSquareText, Network, Telescope, type LucideIcon } from "lucide-react";

export type Skill = {
  id: string;
  name: string;
  descriptionKey: string;
  /** Translated name, for skills whose name changes with the language. */
  nameKey?: string;
  /** Shown instead of `/images/tech-icons/<id>` when there's no logo image. */
  Icon?: LucideIcon;
  /** Reuse another skill's icon (e.g. GPTs → chatgpt). */
  iconId?: string;
};

export type Stack = {
  id: "frontend" | "backend" | "database" | "ai-models" | "ai-custom" | "ai-agents" | "ai-methods";
  /** "dev" groups render under the stack block, "ai" groups under the AI block. */
  area: "dev" | "ai";
  labelKey: string;
  skills: Skill[];
};

export const STACK_LIST: Stack[] = [
  {
    id: "frontend",
    area: "dev",
    labelKey: "skills.frontend",
    skills: [
      {
        id: "javascript",
        name: "JavaScript",
        descriptionKey: "skills.stack.frontend.javascript",
      },
      {
        id: "typescript",
        name: "TypeScript",
        descriptionKey: "skills.stack.frontend.typescript",
      },
      {
        id: "react1",
        name: "React JS",
        descriptionKey: "skills.stack.frontend.react1",
      },
      {
        id: "react2",
        name: "React Native",
        descriptionKey: "skills.stack.frontend.react2",
      },
      {
        id: "next",
        name: "Next.js",
        descriptionKey: "skills.stack.frontend.next",
      },
      {
        id: "html",
        name: "HTML",
        descriptionKey: "skills.stack.frontend.html",
      },
    ],
  },
  {
    id: "backend",
    area: "dev",
    labelKey: "skills.backend",
    skills: [
      {
        id: "nodejs",
        name: "Node.js",
        descriptionKey: "skills.stack.backend.nodejs",
      },
      {
        id: "c-sharp",
        name: "C#",
        descriptionKey: "skills.stack.backend.c-sharp",
      },
      {
        id: "python",
        name: "Python",
        descriptionKey: "skills.stack.backend.python",
      },
      {
        id: "php",
        name: "PHP",
        descriptionKey: "skills.stack.backend.php",
      },
    ],
  },
  {
    id: "database",
    area: "dev",
    labelKey: "skills.database",
    skills: [
      {
        id: "sqlServer",
        name: "SQL Server",
        descriptionKey: "skills.stack.database.sqlServer",
      },
      {
        id: "postgress",
        name: "PostgreSQL",
        descriptionKey: "skills.stack.database.postgress",
      },
      {
        id: "git",
        name: "Git",
        descriptionKey: "skills.stack.database.git",
      },
      {
        id: "vite",
        name: "Vite",
        descriptionKey: "skills.stack.database.vite",
      },
    ],
  },
  {
    id: "ai-models",
    area: "ai",
    labelKey: "skills.aiModels",
    skills: [
      { id: "chatgpt", name: "ChatGPT", descriptionKey: "skills.stack.ai.chatgpt" },
      { id: "claude", name: "Claude", descriptionKey: "skills.stack.ai.claude" },
      { id: "gemini", name: "Gemini", descriptionKey: "skills.stack.ai.gemini" },
      { id: "perplexity", name: "Perplexity", descriptionKey: "skills.stack.ai.perplexity", Icon: Telescope },
    ],
  },
  {
    id: "ai-custom",
    area: "ai",
    labelKey: "skills.aiCustom",
    skills: [
      { id: "gpts", name: "GPTs (OpenAI)", descriptionKey: "skills.stack.ai.gpts", iconId: "chatgpt" },
      { id: "gems", name: "Gems (Google)", descriptionKey: "skills.stack.ai.gems", iconId: "gemini" },
      { id: "notebooklm", name: "NotebookLM", descriptionKey: "skills.stack.ai.notebooklm" },
      { id: "claude-design", name: "Claude Design", descriptionKey: "skills.stack.ai.claude-design", iconId: "claude" },
    ],
  },
  {
    id: "ai-agents",
    area: "ai",
    labelKey: "skills.aiAgents",
    skills: [
      { id: "claude-code", name: "Claude Code", descriptionKey: "skills.stack.ai.claude-code", iconId: "claude" },
      { id: "opencode", name: "OpenCode", descriptionKey: "skills.stack.ai.opencode" },
      { id: "gentle-ai", name: "Gentle AI", descriptionKey: "skills.stack.ai.gentle-ai", Icon: BrainCircuit },
      { id: "openrouter", name: "OpenRouter", descriptionKey: "skills.stack.ai.openrouter" },
      { id: "agents-office", name: "Oficina 3D de agentes", nameKey: "skills.names.agents-office", descriptionKey: "skills.stack.ai.agents-office", Icon: Building2 },
    ],
  },
  {
    id: "ai-methods",
    area: "ai",
    labelKey: "skills.aiMethods",
    skills: [
      { id: "sdd", name: "Spec-Driven Development", descriptionKey: "skills.stack.ai.sdd" },
      { id: "prompt-engineering", name: "Prompt Engineering", descriptionKey: "skills.stack.ai.prompt-engineering", Icon: MessageSquareText },
      { id: "rag", name: "RAG & Grounding", descriptionKey: "skills.stack.ai.rag", Icon: DatabaseZap },
      { id: "multi-agent", name: "Orquestación multi-agente", nameKey: "skills.names.multi-agent", descriptionKey: "skills.stack.ai.multi-agent", Icon: Network },
    ],
  },
];
