import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import type { AboutContent } from "../hooks/useLocalAbout";

interface AboutFormProps {
  about: AboutContent;
  onSave: (about: AboutContent) => void;
  onCancel: () => void;
}

export default function AboutForm({ about, onSave, onCancel }: AboutFormProps) {
  const [heading, setHeading] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  // Paragraphs are edited as one textarea, separated by a blank line each —
  // simpler for a supervisor/owner to type than managing separate fields
  // per paragraph.
  useEffect(() => {
    setHeading(about.heading);
    setBody(about.paragraphs.join("\n\n"));
    setError("");
  }, [about]);

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

    const paragraphs = body
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    if (!heading.trim() || paragraphs.length === 0) {
      setError("Heading and at least one paragraph are required.");
      return;
    }

    onSave({ heading: heading.trim(), paragraphs });
  };

  return createPortal(
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-panel" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCancel} aria-label="Close">✕</button>
        <h3>Edit About</h3>

        <form className="project-form" onSubmit={handleSubmit}>
          <label htmlFor="af-heading">Heading</label>
          <input id="af-heading" value={heading} onChange={(e) => setHeading(e.target.value)} />

          <label htmlFor="af-body">Paragraphs (leave a blank line between each)</label>
          <textarea
            id="af-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            style={{ minHeight: "180px" }}
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