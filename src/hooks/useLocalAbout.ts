import { useEffect, useState } from "react";

export interface AboutContent {
  heading: string;
  paragraphs: string[];
}

const STORAGE_KEY = "portfolio_about";

const defaultAbout: AboutContent = {
  heading: "I'm Favour, a Software Engineer and Digital Creative.",
  paragraphs: [
    "I am a Software Engineering student with a passion for building digital solutions and creating meaningful user experiences.",
    "My experience includes web and mobile application development, UI design, graphic design, branding and technical support.",
    "I enjoy turning ideas into functional and visually appealing digital products while continuously improving my technical skills.",
  ],
};

function loadAbout(): AboutContent {
  if (typeof window === "undefined") return defaultAbout;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAbout;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.heading === "string" && Array.isArray(parsed.paragraphs)) {
      return parsed;
    }
    return defaultAbout;
  } catch {
    return defaultAbout;
  }
}

export function useLocalAbout() {
  const [about, setAbout] = useState<AboutContent>(loadAbout);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(about));
    } catch {
      // ignore storage failures
    }
  }, [about]);

  // UPDATE — the only mutation About needs, since it's a single block of
  // content rather than a list. No add/delete.
  const updateAbout = (updated: AboutContent) => {
    setAbout(updated);
  };

  const resetAbout = () => setAbout(defaultAbout);

  return { about, updateAbout, resetAbout };
}