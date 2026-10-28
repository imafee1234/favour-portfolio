import { useState, type MouseEvent } from "react";
import Reveal from "./Reveal";
import ExperienceForm from "./ExperienceForm";
import { useLocalExperience } from "../hooks/useLocalExperience";
import type { ExperienceEntry } from "../hooks/useLocalExperience";
import { useAdmin } from "../context/AdminContext";

export default function Experience() {
  const { experience, addExperience, updateExperience, deleteExperience, resetExperience } =
    useLocalExperience();
  const { isAdmin } = useAdmin();

  const [formOpen, setFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ExperienceEntry | null>(null);

  const openAddForm = () => {
    setEditingEntry(null);
    setFormOpen(true);
  };

  const openEditForm = (entry: ExperienceEntry, e: MouseEvent) => {
    e.stopPropagation();
    setEditingEntry(entry);
    setFormOpen(true);
  };

  const handleDelete = (entry: ExperienceEntry, e: MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${entry.role}"? This can't be undone.`)) {
      deleteExperience(entry.id);
    }
  };

  const handleSave = (entry: ExperienceEntry) => {
    if (editingEntry) {
      updateExperience(entry.id, entry);
    } else {
      addExperience(entry);
    }
    setFormOpen(false);
    setEditingEntry(null);
  };

  return (
    <Reveal as="section" id="experience">
      <div className="section-heading">
        <p>My journey</p>
        <h2>Experience</h2>
      </div>

      {isAdmin && (
        <div className="project-toolbar">
          <button onClick={resetExperience}>Reset demo data</button>
          <button className="btn-primary" onClick={openAddForm}>+ Add Experience</button>
        </div>
      )}

      <div className="experience-container">
        {experience.map((entry) => (
          <div className="experience-card" key={entry.id}>
            <h3>{entry.role}</h3>
            <h4>{entry.company}</h4>
            {entry.companySub && <p className="experience-sub">{entry.companySub}</p>}
            <span>{entry.date}</span>
            <p>{entry.description}</p>
            {isAdmin && (
              <div className="project-card-actions">
                <button onClick={(e) => openEditForm(entry, e)}>Edit</button>
                <button className="btn-delete" onClick={(e) => handleDelete(entry, e)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {formOpen && (
        <ExperienceForm
          entry={editingEntry}
          onSave={handleSave}
          onCancel={() => {
            setFormOpen(false);
            setEditingEntry(null);
          }}
        />
      )}
    </Reveal>
  );
}
