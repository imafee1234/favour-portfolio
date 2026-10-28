import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import type { ExperienceEntry } from "../hooks/useLocalExperience";

interface ExperienceFormProps {
  entry: ExperienceEntry | null;
  onSave: (entry: ExperienceEntry) => void;
  onCancel: () => void;
}

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function ExperienceForm({ entry, onSave, onCancel }: ExperienceFormProps) {
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [companySub, setCompanySub] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (entry) {
      setRole(entry.role);
      setCompany(entry.company);
      setCompanySub(entry.companySub || "");
      setDate(entry.date);
      setDescription(entry.description);
    } else {
      setRole("");
      setCompany("");
      setCompanySub("");
      setDate("");
      setDescription("");
    }
    setError("");
  }, [entry]);

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
    if (!role.trim() || !company.trim() || !date.trim() || !description.trim()) {
      setError("Role, company, date, and description are required.");
      return;
    }
    onSave({
      id: entry ? entry.id : generateId(),
      role: role.trim(),
      company: company.trim(),
      companySub: companySub.trim() || undefined,
      date: date.trim(),
      description: description.trim(),
    });
  };

  return createPortal(
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-panel" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCancel} aria-label="Close">✕</button>
        <h3>{entry ? "Edit Experience" : "Add Experience"}</h3>

        <form className="project-form" onSubmit={handleSubmit}>
          <label htmlFor="ef-role">Role / title</label>
          <input id="ef-role" value={role} onChange={(e) => setRole(e.target.value)} />

          <label htmlFor="ef-company">Company / organization</label>
          <input id="ef-company" value={company} onChange={(e) => setCompany(e.target.value)} />

          <label htmlFor="ef-company-sub">Second line (optional)</label>
          <input id="ef-company-sub" value={companySub} onChange={(e) => setCompanySub(e.target.value)} />

          <label htmlFor="ef-date">Date range</label>
          <input id="ef-date" value={date} onChange={(e) => setDate(e.target.value)} placeholder="2026 - Present" />

          <label htmlFor="ef-description">Description</label>
          <textarea id="ef-description" value={description} onChange={(e) => setDescription(e.target.value)} />

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