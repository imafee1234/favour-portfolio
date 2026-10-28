import { useState, type MouseEvent } from "react";
import Reveal from "./Reveal";
import ProjectModal from "./ProjectModal";
import type { Project } from "./ProjectModal";
import ProjectForm from "./ProjectForm";
import { useLocalProjects } from "../hooks/useLocalProjects";
import { useAdmin } from "../context/AdminContext";

const categories = ["All", "Web", "Mobile", "Design", "Branding"];

export default function Projects() {
  const { projects, addProject, updateProject, deleteProject, resetProjects } =
    useLocalProjects();
  const { isAdmin } = useAdmin();

  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const filtered = projects.filter(
    (project) => activeCategory === "All" || project.category === activeCategory
  );

  const openAddForm = () => {
    setEditingProject(null);
    setFormOpen(true);
  };

  const openEditForm = (project: Project, e: MouseEvent) => {
    e.stopPropagation();
    setEditingProject(project);
    setFormOpen(true);
  };

  const handleDelete = (project: Project, e: MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${project.title}"? This can't be undone.`)) {
      deleteProject(project.id);
    }
  };

  const handleSave = (project: Project) => {
    if (editingProject) {
      updateProject(project.id, project);
    } else {
      addProject(project);
    }
    setFormOpen(false);
    setEditingProject(null);
  };

  return (
    <Reveal as="section" id="projects">
      <div className="section-heading">
        <p>My recent work</p>
        <h2>Projects</h2>
      </div>

      <div className="project-filters">
        {categories.map((category) => (
          <button
            key={category}
            className={activeCategory === category ? "active" : ""}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {isAdmin && (
        <div className="project-toolbar">
          <button onClick={resetProjects}>Reset demo data</button>
          <button className="btn-primary" onClick={openAddForm}>
            + Add Project
          </button>
        </div>
      )}

      <div id="projects-container">
        {filtered.length === 0 ? (
          <p className="projects-empty">No projects in this category yet.</p>
        ) : (
          filtered.map((project) => (
            <div
              className="project-card"
              key={project.id}
              onClick={() => setSelectedProject(project)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") setSelectedProject(project);
              }}
            >
              <h3>{project.title}</h3>
              <p>{project.category}</p>
              <p>{project.description}</p>
              {isAdmin && (
                <div className="project-card-actions">
                  <button onClick={(e) => openEditForm(project, e)}>Edit</button>
                  <button className="btn-delete" onClick={(e) => handleDelete(project, e)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      {formOpen && (
        <ProjectForm
          project={editingProject}
          onSave={handleSave}
          onCancel={() => {
            setFormOpen(false);
            setEditingProject(null);
          }}
        />
      )}
    </Reveal>
  );
}
