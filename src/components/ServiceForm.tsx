import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import type { Service } from "../hooks/useLocalServices";

interface ServiceFormProps {
  service: Service | null;
  onSave: (service: Service) => void;
  onCancel: () => void;
}

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function ServiceForm({ service, onSave, onCancel }: ServiceFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (service) {
      setTitle(service.title);
      setDescription(service.description);
    } else {
      setTitle("");
      setDescription("");
    }
    setError("");
  }, [service]);

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
      setError("Title and description are required.");
      return;
    }
    onSave({ id: service ? service.id : generateId(), title: title.trim(), description: description.trim() });
  };

  return createPortal(
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-panel" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCancel} aria-label="Close">✕</button>
        <h3>{service ? "Edit Service" : "Add Service"}</h3>

        <form className="project-form" onSubmit={handleSubmit}>
          <label htmlFor="svf-title">Title</label>
          <input id="svf-title" value={title} onChange={(e) => setTitle(e.target.value)} />

          <label htmlFor="svf-description">Description</label>
          <textarea id="svf-description" value={description} onChange={(e) => setDescription(e.target.value)} />

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