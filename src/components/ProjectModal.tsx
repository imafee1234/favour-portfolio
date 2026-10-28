import { useEffect } from "react";
import { createPortal } from "react-dom";

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription?: string;
  tech?: string[];
  link?: string;
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  if (!project) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <span className="modal-tag">{project.category}</span>
        <h3 id="modal-title">{project.title}</h3>
        <p>{project.longDescription || project.description}</p>

        {project.tech && project.tech.length > 0 && (
          <div className="modal-tech">
            {project.tech.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        )}

        {project.link && (
          <a className="modal-link" href={project.link} target="_blank" rel="noreferrer">
            View Project
          </a>
        )}
      </div>
    </div>,
    document.body
  );
}