import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import type { Project } from "./ProjectModal";

interface ProjectFormProps {
  project: Project | null; // null = creating a new project, otherwise editing this one
  onSave: (project: Project) => void;
  onCancel: () => void;
}

const CATEGORY_OPTIONS = ["Web", "Mobile", "Design", "Branding"];

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Web");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [techInput, setTechInput] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState("");

  // Pre-fill the form when editing an existing project; reset it when adding new.
  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setCategory(project.category);
      setDescription(project.description);
      setLongDescription(project.longDescription || "");
      setTechInput((project.tech || []).join(", "));
      setLink(project.link || "");
    } else {
      setTitle("");
      setCategory("Web");
      setDescription("");
      setLongDescription("");
      setTechInput("");
      setLink("");
    }
    setError("");
  }, [project]);

  // Same scroll-lock + Escape-to-close pattern as ProjectModal.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onCancel]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Title and short description are required.");
      return;
    }

    const tech = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      id: project ? project.id : generateId(),
      title: title.trim(),
      category,
      description: description.trim(),
      longDescription: longDescription.trim() || undefined,
      tech: tech.length > 0 ? tech : undefined,
      link: link.trim() || undefined,
    });
  };

  return createPortal(
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onCancel} aria-label="Close">
          ✕
        </button>

        <h3 id="form-title">{project ? "Edit Project" : "Add Project"}</h3>

        <form className="project-form" onSubmit={handleSubmit}>
          <label htmlFor="pf-title">Title</label>
          <input id="pf-title" value={title} onChange={(e) => setTitle(e.target.value)} />

          <label htmlFor="pf-category">Category</label>
          <select id="pf-category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <label htmlFor="pf-description">Short description</label>
          <input
            id="pf-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label htmlFor="pf-long">Full description (optional)</label>
          <textarea
            id="pf-long"
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
          />

          <label htmlFor="pf-tech">Tech stack, comma-separated (optional)</label>
          <input
            id="pf-tech"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="React, Node.js, MySQL"
          />

          <label htmlFor="pf-link">Project link (optional)</label>
          <input
            id="pf-link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
          />

          {error && <p className="project-form-error">{error}</p>}

          <div className="project-form-actions">
            <button type="submit" className="btn-save">
              Save
            </button>
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}