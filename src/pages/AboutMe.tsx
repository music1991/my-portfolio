import { GraduationCap, Briefcase, Heart, Languages, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../context/Language";
// Typewriter effect disabled: the intro is now rendered as static text (see below)
// import TypewriterLines from "../components/TypewriterLines";
import AboutSidebar, { type SidebarItem } from "../components/AboutSidebar";
import React, { useMemo, useState } from "react";
import images from "../images.json";

const volunteerPics = images.motivation.volunteerPics;
const communityPics = images.motivation.communityPics ?? [];
const theaterPics = images.motivation.theaterPics ?? [];
const exercisePics = images.motivation.exercisePics ?? [];


const Polaroid: React.FC<{ src: string; caption?: string; rotate?: number }> = ({ src, caption, rotate = 0 }) => (
  <figure
    className={`relative bg-card rounded-sm shadow-xl ring-1 ring-border p-3 w-44 sm:w-52 md:w-56
                transition-transform duration-300 hover:-translate-y-1`}
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    <img
      src={src}
      alt={caption ?? ""}
      className="block w-full h-44 sm:h-52 md:h-56 object-cover rounded-[2px]"
      draggable={false}
    />
    {caption && (
      <figcaption className="mt-2 text-[12px] text-muted-foreground text-center">
        {caption}
      </figcaption>
    )}
    <div className="pointer-events-none absolute inset-0 rounded-sm shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]" />
  </figure>
);

const POLAROID_ROTATIONS = [-6, 4, -2, 5];

const PolaroidRow: React.FC<{ images: { src: string; caption?: string }[] }> = ({ images }) => (
  <div className="mt-4 flex items-start justify-center gap-4 sm:gap-6 flex-wrap">
    {images.map((img, i) => (
      <Polaroid
        key={img.src}
        src={img.src}
        caption={img.caption}
        rotate={POLAROID_ROTATIONS[i % POLAROID_ROTATIONS.length]}
      />
    ))}
  </div>
);


const AboutPage: React.FC = () => {
  const { t, tObj } = useLanguage();

  const aboutLines = useMemo(
    () => t("profile.about.content").split("\n").filter((l) => l.trim().length > 0),
    [t]
  );

  type LangItem = { name: string; level: string };
  type EduItem = { degree: string; institution: string; year: string; description?: string };
  type JobItem = { role: string; company: string; period: string; details: string[], tecnologies: string[]; link?: string };

  const jobs = useMemo(() => tObj<JobItem[]>("profile.experience.jobs") ?? [], [tObj]);
  const langs = tObj<LangItem[]>("profile.languages.list") ?? [];

  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches
  );

  const sidebarItems = useMemo<SidebarItem[]>(
    () => [
      { id: "about", label: t("profile.nav.intro") },
      {
        id: "experience",
        label: t("profile.experience.title"),
        children: jobs.map((job, i) => ({ id: `job-${i}`, label: job.company.split(" · ")[0] })),
      },
      { id: "education", label: t("profile.education.title") },
      { id: "languages", label: t("profile.languages.title") },
      {
        id: "motivations",
        label: t("profile.motivations.title"),
        children: [
          { id: "motivation-community", label: t("profile.motivations.community.title") },
          { id: "motivation-volunteer", label: t("profile.motivations.volunteer.title") },
          { id: "motivation-theater", label: t("profile.motivations.theater.title") },
          { id: "motivation-exercise", label: t("profile.motivations.exercise.title") },
        ],
      },
    ],
    [t, jobs]
  );

  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      <header className="text-center py-10 bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md">
        <h1 className="sr-only">{t("aboutMe.text")}</h1>
        <p className="text-lg opacity-90 mt-20">{t("profile.header.subtitle")}</p>
      </header>

      <AboutSidebar items={sidebarItems} open={sidebarOpen} onToggle={() => setSidebarOpen((o) => !o)} />

      <div
        className={`transition-[padding] duration-300 ease-out ${sidebarOpen ? "lg:pr-64" : ""}`}
      >
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-20 space-y-24">
        <section id="about" className="scroll-mt-20">
          <div className="bg-card rounded-2xl shadow-sm border border-border p-8 md:p-10">
            <h2 className="text-2xl font-semibold text-card-foreground mb-6">
              {t("profile.about.heading")}
            </h2>
            <div className="prose prose-gray max-w-none leading-relaxed">
              {/* <TypewriterLines
                lines={aboutLines}
                typingSpeed={10}
                lineDelay={200}
              /> */}
              {aboutLines.map((line, i) => (
                <p key={i} className="mb-4 text-foreground">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="w-7 h-7 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">
              {t("profile.experience.title")}
            </h2>
          </div>
          <div className="space-y-8 border-l-2 border-border pl-6">
            {jobs.map((job, i) => (
              <div key={`${job.company}-${job.role}`} id={`job-${i}`} className="scroll-mt-24">
                <h3 className="text-lg font-bold text-foreground">{job.role}</h3>
                {job.link ? (
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-accent transition-colors"
                  >
                    {job.company}
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                ) : (
                  <p className="text-muted-foreground">{job.company}</p>
                )}
                <p className="text-sm text-muted-foreground mt-1">{job.period}</p>
                <ul className="list-disc list-inside text-foreground/90 mt-2 space-y-1">
                  {job.details.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
                {job.tecnologies && <div className="w-full mt-6">
                  <h3 className="list-disc list-inside text-foreground/90 my-3 space-y-1">{t?.("projects.tecnologies")}</h3>

                  <div className="flex flex-wrap gap-2">
                    {job.tecnologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm text-accent rounded-full border border-border"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>}
              </div>
            ))}
          </div>
        </section>

        <section id="education" className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="w-7 h-7 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">
              {t("profile.education.title")}
            </h2>
          </div>
          <ul className="space-y-6 border-l-2 border-border pl-6">
            {tObj<EduItem[]>("profile.education.items")?.map((edu) => (
              <li key={`${edu.degree}-${edu.institution}`}>
                <h3 className="text-lg font-bold text-foreground">{edu.degree}</h3>
                {edu.institution && <p className="text-muted-foreground">{edu.institution}</p>}
                <p className="text-sm text-muted-foreground">{edu.year}</p>
                {edu.description && <p className="text-foreground/90 mt-1">{edu.description}</p>}
              </li>
            ))}
          </ul>
        </section>

        <section id="languages" className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Languages className="w-7 h-7 text-accent" />
            <h2 className="text-2xl font-semibold text-foreground">
              {t("profile.languages.title")}
            </h2>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {langs.map((lang) => (
              <li key={lang.name} className="p-6 bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-all duration-300">
                <h3 className="text-lg font-semibold text-card-foreground mb-1">{lang.name}</h3>
                <p className="text-muted-foreground text-sm">{lang.level}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="motivations" className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-7 h-7 text-destructive" />
            <h2 className="text-2xl font-semibold text-foreground">
              {t?.("profile.motivations.title") ?? ""}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div id="motivation-community" className="scroll-mt-24 p-6 bg-card rounded-2xl shadow-sm border border-border hover:shadow-md transition-all sm:col-span-2">
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                {t("profile.motivations.community.title")}
              </h3>
              <PolaroidRow images={communityPics} />
              <p className="text-foreground/90 mt-10 mb-5">
                {t("profile.motivations.community.desc")
                  .split(/(\{undercode\}|\{cluster\})/)
                  .map((part, i) => {
                    const inlineLinks: Record<string, { href: string; label: string }> = {
                      "{undercode}": { href: t("profile.motivations.community.link"), label: "Undercode" },
                      "{cluster}": {
                        href: t("profile.motivations.community.clusterLink"),
                        label: t("profile.motivations.community.cluster"),
                      },
                    };
                    const link = inlineLinks[part];
                    if (!link) return <React.Fragment key={i}>{part}</React.Fragment>;
                    return (
                      <a
                        key={i}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 font-semibold text-accent hover:underline"
                      >
                        {link.label}
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    );
                  })}
              </p>
            </div>

            <div id="motivation-volunteer" className="scroll-mt-24 p-6 bg-card rounded-2xl shadow-sm border border-border hover:shadow-md transition-all sm:col-span-2">
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                {t?.("profile.motivations.volunteer.title") ?? ""}
              </h3>
              <PolaroidRow images={volunteerPics} />
              <p className="list-disc list-inside text-foreground/90 mt-10 mb-5 space-y-1 whitespace-pre-line">
                {t?.("profile.motivations.volunteer.desc") ?? ""}
              </p>
            </div>

            <div id="motivation-theater" className="scroll-mt-24 p-6 bg-card rounded-2xl shadow-sm border border-border hover:shadow-md transition-all sm:col-span-2">
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                {t?.("profile.motivations.theater.title") ?? ""}
              </h3>
              <PolaroidRow images={theaterPics} />
              <p className="list-disc list-inside text-foreground/90 mt-10 mb-5 space-y-1">
                {t?.("profile.motivations.theater.desc") ?? ""}
              </p>
          {/* <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 text-sm rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {t?.("profile.motivations.theater.creativity") ?? ""}
                </span>
                <span className="px-3 py-1.5 text-sm rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {t?.("profile.motivations.theater") ?? ""}
                </span>
                <span className="px-3 py-1.5 text-sm rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {t?.("profile.motivations.theater") ?? ""}
                </span>
              </div> */}
            </div>

            <div id="motivation-exercise" className="scroll-mt-24 p-6 bg-card rounded-2xl shadow-sm border border-border hover:shadow-md transition-all sm:col-span-2">
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                {t?.("profile.motivations.exercise.title") ?? ""}
              </h3>
              <PolaroidRow images={exercisePics} />
              <p className="list-disc list-inside text-foreground/90 mt-10 mb-5 space-y-1">
                {t?.("profile.motivations.exercise.desc") ?? ""}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 text-sm rounded-full bg-accent/10 text-accent border border-accent/20">
                  {t?.("profile.motivations.exercise.bike") ?? ""}
                </span>
                <span className="px-3 py-1.5 text-sm rounded-full bg-accent/10 text-accent border border-accent/20">
                  {t?.("profile.motivations.exercise.run") ?? ""}
                </span>
                <span className="px-3 py-1.5 text-sm rounded-full bg-accent/10 text-accent border border-accent/20">
                  {t?.("profile.motivations.exercise.gym") ?? ""}
                </span>
                <span className="px-3 py-1.5 text-sm rounded-full bg-accent/10 text-accent border border-accent/20">
                  {t?.("profile.motivations.exercise.other")}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
      </div>
    </main>
  );
};

export default AboutPage;
