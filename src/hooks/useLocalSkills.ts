import { useEffect, useState } from "react";

export interface SkillGroup {
  id: string;
  title: string;
  items: string[];
}

const STORAGE_KEY = "portfolio_skills";

const defaultSkills: SkillGroup[] = [
  { id: "s1", title: "Frontend", items: ["HTML", "CSS", "JavaScript", "React"] },
  { id: "s2", title: "Mobile Development", items: ["React Native"] },
  { id: "s3", title: "Backend & Database", items: ["Node.js", "MySQL"] },
  { id: "s4", title: "Tools & Design", items: ["Git/GitHub", "Figma"] },
];

function loadSkills(): SkillGroup[] {
  if (typeof window === "undefined") return defaultSkills;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSkills;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultSkills;
  } catch {
    return defaultSkills;
  }
}

export function useLocalSkills() {
  const [skills, setSkills] = useState<SkillGroup[]>(loadSkills);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
    } catch {
      // ignore storage failures
    }
  }, [skills]);

  const addSkill = (group: SkillGroup) => {
    setSkills((prev) => [...prev, group]);
  };

  const updateSkill = (id: string, updated: SkillGroup) => {
    setSkills((prev) => prev.map((g) => (g.id === id ? updated : g)));
  };

  const deleteSkill = (id: string) => {
    setSkills((prev) => prev.filter((g) => g.id !== id));
  };

  const resetSkills = () => setSkills(defaultSkills);

  return { skills, addSkill, updateSkill, deleteSkill, resetSkills };
}