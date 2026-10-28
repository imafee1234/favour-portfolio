import { useState, type FormEvent } from "react";
import Reveal from "./Reveal.jsx";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formMessage, setFormMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const FORMSPREE_URL = "https://formspree.io/f/mnppvabw";

// inside Contact():
const [sending, setSending] = useState(false);
  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  setFormData({ ...formData, [e.target.id]: e.target.value });
};

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const { name, email, subject, message } = formData;

  if (!name || !email || !subject || !message) {
    setFormMessage("Please fill in all fields");
    setIsSuccess(false);
    return;
  }

  setSending(true);
  setFormMessage("");

  try {
    const res = await fetch(FORMSPREE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error("Request failed");

    setFormMessage("Message sent! I'll get back to you soon.");
    setIsSuccess(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  } catch {
    setFormMessage(
      "Something went wrong. Please email me directly at imafidorf@gmail.com."
    );
    setIsSuccess(false);
  } finally {
    setSending(false);
  }
};

  return (
    <Reveal as="section" id="contact">
      <div className="section-heading">
        <p>Let's connect</p>
        <h2>Get In Touch</h2>
      </div>
      <div className="contact-container">
        <div className="contact-info">
          <a href="mailto:imafidorf@gmail.com">imafidorf@gmail.com</a>
          <p>Location: Abuja, Nigeria</p>
          <p>Available for Freelance and Projects</p>
          <a href="https://github.com/imafee1234">My GitHub</a>
          <a href="https://www.linkedin.com/in/imafidor-divinefavour-16713b345/">My LinkedIn</a>
          <a href="/cv.pdf" download>Download CV</a>
        </div>
        <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Your name"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Your email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />

          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            placeholder="What is this about?"
            autoComplete="off"
            value={formData.subject}
            onChange={handleChange}
          />

          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            placeholder="Explain more"
            autoComplete="off"
            value={formData.message}
            onChange={handleChange}
          />

          <p id="form-message" style={{ color: isSuccess ? "green" : undefined }}>
            {formMessage}
          </p>
          <button type="submit" disabled={sending}>
            {sending ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </Reveal>
  );
}
