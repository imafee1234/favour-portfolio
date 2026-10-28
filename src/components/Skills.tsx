import { useState, type MouseEvent } from "react";
import Reveal from "./Reveal";
import SkillForm from "./SkillForm";
import { useLocalSkills } from "../hooks/useLocalSkills";
import type { SkillGroup } from "../hooks/useLocalSkills";
import { useAdmin } from "../context/AdminContext";

export default function Skills() {
  const { skills, addSkill, updateSkill, deleteSkill, resetSkills } = useLocalSkills();
  const { isAdmin } = useAdmin();

  const [formOpen, setFormOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillGroup | null>(null);

  const openAddForm = () => {
    setEditingSkill(null);
    setFormOpen(true);
  };

  const openEditForm = (skill: SkillGroup, e: MouseEvent) => {
    e.stopPropagation();
    setEditingSkill(skill);
    setFormOpen(true);
  };

  const handleDelete = (skill: SkillGroup, e: MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${skill.title}"? This can't be undone.`)) {
      deleteSkill(skill.id);
    }
  };

  const handleSave = (skill: SkillGroup) => {
    if (editingSkill) {
      updateSkill(skill.id, skill);
    } else {
      addSkill(skill);
    }
    setFormOpen(false);
    setEditingSkill(null);
  };

  return (
    <Reveal as="section" id="skills">
      <div className="section-heading">
        <p>My toolkit</p>
        <h2>Skills & Technologies</h2>
      </div>

      {isAdmin && (
        <div className="project-toolbar">
          <button onClick={resetSkills}>Reset demo data</button>
          <button className="btn-primary" onClick={openAddForm}>+ Add Category</button>
        </div>
      )}

      <div className="skills-container">
        {skills.map((group) => (
          <div className="skill-card" key={group.id}>
            <h3>{group.title}</h3>
            <div className="skill-items-wrap">
              {group.items.map((item) => (
                <p key={item}>{item}</p>
              ))}
              {isAdmin && (
                <div className="project-card-actions">
                  <button onClick={(e) => openEditForm(group, e)}>Edit</button>
                  <button className="btn-delete" onClick={(e) => handleDelete(group, e)}>Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {formOpen && (
        <SkillForm
          skill={editingSkill}
          onSave={handleSave}
          onCancel={() => {
            setFormOpen(false);
            setEditingSkill(null);
          }}
        />
      )}
    </Reveal>
  );
}
