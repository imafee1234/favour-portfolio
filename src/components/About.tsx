import { useState } from "react";
import Reveal from "./Reveal";
import AboutForm from "./AboutForm";
import { useLocalAbout } from "../hooks/useLocalAbout";
import { useAdmin } from "../context/AdminContext";

export default function About() {
  const { about, updateAbout, resetAbout } = useLocalAbout();
  const { isAdmin } = useAdmin();

  const [formOpen, setFormOpen] = useState(false);

  return (
    <Reveal as="section" id="about">
      <div className="section-heading">
        <p>Get to know me</p>
        <h2>About Me</h2>
      </div>

      {isAdmin && (
        <div className="project-toolbar">
          <button onClick={resetAbout}>Reset demo data</button>
          <button className="btn-primary" onClick={() => setFormOpen(true)}>Edit About</button>
        </div>
      )}

      <div className="about-content">
        <div className="about-text">
          <h3>{about.heading}</h3>
          {about.paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>

      {formOpen && (
        <AboutForm
          about={about}
          onSave={(updated) => {
            updateAbout(updated);
            setFormOpen(false);
          }}
          onCancel={() => setFormOpen(false)}
        />
      )}
    </Reveal>
  );
}
