import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import type { SkillGroup } from "../hooks/useLocalSkills";

interface SkillFormProps {
  skill: SkillGroup | null;
  onSave: (skill: SkillGroup) => void;
  onCancel: () => void;
}

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function SkillForm({ skill, onSave, onCancel }: SkillFormProps) {
  const [title, setTitle] = useState("");
  const [itemsInput, setItemsInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (skill) {
      setTitle(skill.title);
      setItemsInput(skill.items.join(", "));
    } else {
      setTitle("");
      setItemsInput("");
    }
    setError("");
  }, [skill]);

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
    const items = itemsInput.split(",").map((i) => i.trim()).filter(Boolean);

    if (!title.trim() || items.length === 0) {
      setError("Category name and at least one skill are required.");
      return;
    }

    onSave({ id: skill ? skill.id : generateId(), title: title.trim(), items });
  };

  return createPortal(
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-panel" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCancel} aria-label="Close">✕</button>
        <h3>{skill ? "Edit Skill Category" : "Add Skill Category"}</h3>

        <form className="project-form" onSubmit={handleSubmit}>
          <label htmlFor="sf-title">Category name</label>
          <input id="sf-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Frontend" />

          <label htmlFor="sf-items">Skills, comma-separated</label>
          <input
            id="sf-items"
            value={itemsInput}
            onChange={(e) => setItemsInput(e.target.value)}
            placeholder="HTML, CSS, JavaScript"
          />

          {error && <p className="project-form-error">{error}</p>}

          <div className="project-form-actions">
            <button type="submit" className="btn-save">Save</button>
            <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}