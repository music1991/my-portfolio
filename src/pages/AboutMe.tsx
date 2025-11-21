import { GraduationCap, Briefcase, Heart, Languages } from "lucide-react";
import { useLanguage } from "../context/Language";
import TypewriterLines from "../components/TypewriterLines";
import React, { useMemo } from "react";
import images from "../images.json";

const volunteerPics = images.motivation.volunteerPics;
const theaterPics = images.motivation.theaterPics ?? [];
const exercisePics = images.motivation.exercisePics ?? [];


const Polaroid: React.FC<{ src: string; caption?: string; rotate?: number }> = ({ src, caption, rotate = 0 }) => (
  <figure
    className={`relative bg-white rounded-sm shadow-xl ring-1 ring-black/10 p-3 w-44 sm:w-52 md:w-56
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
      <figcaption className="mt-2 text-[12px] text-gray-700 text-center">
        {caption}
      </figcaption>
    )}
    <div className="pointer-events-none absolute inset-0 rounded-sm shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]" />
  </figure>
);

const PolaroidRow: React.FC<{ images: { src: string; caption?: string }[] }> = ({ images }) => (
  <div className="mt-4 flex items-start justify-center gap-4 sm:gap-6 flex-wrap">
    <Polaroid src={images[0]?.src} caption={images[0]?.caption} rotate={-6} />
    <Polaroid src={images[1]?.src} caption={images[1]?.caption} rotate={4} />
    {images[2] && <Polaroid src={images[2]?.src} caption={images[2]?.caption} rotate={-2} />}
  </div>
);


const AboutPage: React.FC = () => {
  const { t, tObj } = useLanguage();

  const aboutLines = useMemo(
    () => t("profile.about.content").split("\n").filter((l) => l.trim().length > 0),
    [t]
  );

  type LangItem = { name: string; level: string };
  type EduItem = { degree: string; institution: string; year: string };
  type JobItem = { role: string; company: string; period: string; details: string[], tecnologies: string[] };

  const jobs = tObj<JobItem[]>("profile.experience.jobs") ?? [];
  const langs = tObj<LangItem[]>("profile.languages.list") ?? [];

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="text-center py-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md">
        <p className="text-lg opacity-90 mt-20">{t("profile.header.subtitle")}</p>
      </header>

      <div className="max-w-5xl mx-auto px-6 md:px-10 py-20 space-y-24">
        <section id="about" className="scroll-mt-20">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {t("profile.about.heading")}
            </h2>
            <div className="prose prose-gray max-w-none leading-relaxed">
              <TypewriterLines
                lines={aboutLines}
                typingSpeed={10}
                lineDelay={200}
              />
            </div>
          </div>
        </section>

        <section id="experience" className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="w-7 h-7 text-purple-600" />
            <h2 className="text-2xl font-semibold text-gray-900">
              {t("profile.experience.title")}
            </h2>
          </div>
          <div className="space-y-8 border-l-2 border-purple-100 pl-6">
            {jobs.map((job) => (
              <div key={`${job.company}-${job.role}`}>
                <h3 className="text-lg font-bold text-gray-900">{job.role}</h3>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-sm text-gray-500 mt-1">{job.period}</p>
                <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                  {job.details.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
                {job.tecnologies && <div className="w-full mt-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Technologies & Tools
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {job.tecnologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm text-blue-700 rounded-full border"
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
            <GraduationCap className="w-7 h-7 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">
              {t("profile.education.title")}
            </h2>
          </div>
          <ul className="space-y-6 border-l-2 border-blue-100 pl-6">
            {tObj<EduItem[]>("profile.education.items")?.map((edu) => (
              <li key={`${edu.degree}-${edu.institution}`}>
                <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.year}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="languages" className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Languages className="w-7 h-7 text-emerald-600" />
            <h2 className="text-2xl font-semibold text-gray-900">
              {t("profile.languages.title")}
            </h2>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {langs.map((lang) => (
              <li key={lang.name} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{lang.name}</h3>
                <p className="text-gray-600 text-sm">{lang.level}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="motivations" className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-7 h-7 text-rose-600" />
            <h2 className="text-2xl font-semibold text-gray-900">
              {t?.("profile.motivations.title") ?? ""}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all sm:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t?.("profile.motivations.volunteer.title") ?? ""}
              </h3>
              <PolaroidRow images={volunteerPics} />
              <p className="list-disc list-inside text-gray-700 mt-10 mb-5 space-y-1 whitespace-pre-line">
                {t?.("profile.motivations.volunteer.desc") ?? ""}
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all sm:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t?.("profile.motivations.theater.title") ?? ""}
              </h3>
              <PolaroidRow images={theaterPics} />
              <p className="list-disc list-inside text-gray-700 mt-10 mb-5 space-y-1">
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

            <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all sm:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t?.("profile.motivations.exercise.title") ?? ""}
              </h3>
              <PolaroidRow images={exercisePics} />
              <p className="list-disc list-inside text-gray-700 mt-10 mb-5 space-y-1">
                {t?.("profile.motivations.exercise.desc") ?? ""}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 text-sm rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {t?.("profile.motivations.exercise.bike") ?? ""}
                </span>
                <span className="px-3 py-1.5 text-sm rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {t?.("profile.motivations.exercise.run") ?? ""}
                </span>
                <span className="px-3 py-1.5 text-sm rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {t?.("profile.motivations.exercise.gym") ?? ""}
                </span>
                <span className="px-3 py-1.5 text-sm rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {t?.("profile.motivations.exercise.other")}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AboutPage;
