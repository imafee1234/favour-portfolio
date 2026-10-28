import { useEffect, useState } from "react";
import type { Project } from "../components/ProjectModal";

// Bumped to _v2 so browsers that saved the old project list load these new defaults.
// Next time you edit the defaults below, bump it again (_v3, _v4, ...).
const STORAGE_KEY = "portfolio_projects_v2";

const defaultProjects: Project[] = [
  {
    id: "p1",
    title: "CleanAlert",
    category: "Mobile",
    description:
      "A mobile app for reporting sanitation and environmental problems in a community.",
    longDescription:
      "A school project that is still in progress. Residents can create an account, log in, and submit an environmental complaint with a description, a location and an attached image. I built the app structure, mobile interface, authentication, report submission and the backend API. An admin dashboard for managing reports is planned, and further testing and integration are still needed.",
    tech: ["React Native", "Expo", "TypeScript", "Node.js", "Express.js", "MySQL", "Multer"],
    link: "https://github.com/imafee1234/CleanAlert2",
  },
  {
    id: "p2",
    title: "RecipeVault",
    category: "Web",
    description: "A recipe website for discovering, saving and organising recipes.",
    longDescription:
      "Users can browse and search recipes, view recipe details, add or edit recipes, and save favourites to a personal collection. I built the interface, recipe pages, dashboard and recipe management interactions, and worked on the layout and deployment issues. The site is deployed and I am still improving its design. Recipes are stored in the browser's local storage, so data is not shared across devices.",
    tech: ["React", "JavaScript", "CSS", "Local Storage"],
    link: "https://github.com/imafee1234/RECIPE-VAULT",
  },
  {
    id: "p3",
    title: "ClassSync",
    category: "Mobile",
    description:
      "A mobile app concept for simplifying classroom attendance for lecturers and students.",
    longDescription:
      "A work in progress. I developed the concept, interface design and screen structure (login, registration, home, attendance and profile) in React Native, with the focus on a simple interface for both lecturers and students. The attendance workflow is still being developed.",
    tech: ["React Native", "Expo Router", "TypeScript"],
    link: "",
  },
  {
    id: "p4",
    title: "Brekete Project",
    category: "Design",
    description: "A UI/UX design project created in Figma.",
    longDescription:
      "A UI/UX design project in Figma. I designed the visual presentation and arrangement of the interface, using layout, spacing and visual hierarchy to make it clear and easy to understand. It is a design only, not a deployed application.",
    tech: ["Figma"],
    link: "https://www.figma.com/design/Z4Qvzr33wWivn5t4i7Tv24/Brekete-Project?node-id=0-1&t=YBdTutdFXe1hSIYw-1",
  },
  {
    id: "p5",
    title: "Estate Management",
    category: "Design",
    description: "A UI/UX design concept for managing estate and property information.",
    longDescription:
      "A Figma design exploring how property managers and users could organise property-related information and activities through a clearer, more user-friendly interface. I designed the visual interface and user experience. It is a design concept, not a working system.",
    tech: ["Figma"],
    link: "https://www.figma.com/design/ll5lUvSZMleoHAJpFTmVDl/Estate-Management?m=auto&t=M7aGoDKAF1Qgs6he-1",
  },
  {
    id: "p6",
    title: "EAI Branding",
    category: "Branding",
    description: "Visual identity and branding design for EAI.",
    longDescription:
      "A branding project to help EAI communicate its identity more consistently through visual design. I worked on the branding and visual design elements.",
    tech: ["ChatGPT", "Canva"],
    link: "",
  },
];

function loadProjects(): Project[] {
  if (typeof window === "undefined") return defaultProjects;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProjects;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultProjects;
  } catch {
    return defaultProjects;
  }
}

export function useLocalProjects() {
  const [projects, setProjects] = useState<Project[]>(loadProjects);

  // Persist to localStorage any time the list changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch {
      // Private browsing / storage full: state still works in memory.
    }
  }, [projects]);

  // CREATE
  const addProject = (project: Project) => {
    setProjects((prev) => [...prev, project]);
  };

  // UPDATE
  const updateProject = (id: string, updated: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  // DELETE
  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // Wipe local edits and restore the seed data.
  const resetProjects = () => {
    setProjects(defaultProjects);
  };

  // READ is just `projects` itself.
  return { projects, addProject, updateProject, deleteProject, resetProjects };
}