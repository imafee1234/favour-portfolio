import { useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useAdmin } from "../context/AdminContext";

interface AdminLoginProps {
  onClose: () => void;
}

export default function AdminLogin({ onClose }: AdminLoginProps) {
  const { login } = useAdmin();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = login(password);
    if (success) {
      onClose();
    } else {
      setError("Incorrect password.");
      setPassword("");
    }
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-login-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <h3 id="admin-login-title">Admin Login</h3>

        <form className="project-form" onSubmit={handleSubmit}>
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />

          {error && <p className="project-form-error">{error}</p>}

          <div className="project-form-actions">
            <button type="submit" className="btn-save">
              Log In
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}