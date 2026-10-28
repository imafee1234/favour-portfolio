import { useEffect, useState } from "react";

export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  companySub?: string;
  date: string;
  description: string;
}

const STORAGE_KEY = "portfolio_experience";

const defaultExperience: ExperienceEntry[] = [
  {
    id: "e1",
    role: "IT / Software Engineering Intern",
    company: "Office of the Auditor-General for the Federation",
    companySub: "Komtemporary Konsulting Ltd",
    date: "2026 - Present",
    description:
      "Currently gaining practical experience in an IT office environment, developing my skills through hands-on assignments and learning. My current work includes building a responsive and dynamic personal portfolio using HTML, CSS and JavaScript while improving my understanding of frontend development and professional software development practices.",
  },
  {
    id: "e2",
    role: "Online IT / Software Development Experience",
    company: "Inamigos Foundation, India - Remote",
    date: "Online Experience",
    description:
      "Worked as part of the graphic design team, creating flyers and other visual content for the foundation's social media platforms. I also participated in activities involving the organization's points system and fundraising initiatives, gaining experience in remote teamwork, communication and digital content creation.",
  },
];

function loadExperience(): ExperienceEntry[] {
  if (typeof window === "undefined") return defaultExperience;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultExperience;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultExperience;
  } catch {
    return defaultExperience;
  }
}

export function useLocalExperience() {
  const [experience, setExperience] = useState<ExperienceEntry[]>(loadExperience);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(experience));
    } catch {
      // ignore storage failures
    }
  }, [experience]);

  const addExperience = (entry: ExperienceEntry) => {
    setExperience((prev) => [...prev, entry]);
  };

  const updateExperience = (id: string, updated: ExperienceEntry) => {
    setExperience((prev) => prev.map((e) => (e.id === id ? updated : e)));
  };

  const deleteExperience = (id: string) => {
    setExperience((prev) => prev.filter((e) => e.id !== id));
  };

  const resetExperience = () => setExperience(defaultExperience);

  return { experience, addExperience, updateExperience, deleteExperience, resetExperience };
}