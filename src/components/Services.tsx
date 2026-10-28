import { useState, type MouseEvent } from "react";
import Reveal from "./Reveal";
import ServiceForm from "./ServiceForm";
import { useLocalServices } from "../hooks/useLocalServices";
import type { Service } from "../hooks/useLocalServices";
import { useAdmin } from "../context/AdminContext";

export default function Services() {
  const { services, addService, updateService, deleteService, resetServices } = useLocalServices();
  const { isAdmin } = useAdmin();

  const [formOpen, setFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const openAddForm = () => {
    setEditingService(null);
    setFormOpen(true);
  };

  const openEditForm = (service: Service, e: MouseEvent) => {
    e.stopPropagation();
    setEditingService(service);
    setFormOpen(true);
  };

  const handleDelete = (service: Service, e: MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${service.title}"? This can't be undone.`)) {
      deleteService(service.id);
    }
  };

  const handleSave = (service: Service) => {
    if (editingService) {
      updateService(service.id, service);
    } else {
      addService(service);
    }
    setFormOpen(false);
    setEditingService(null);
  };

  return (
    <Reveal as="section" id="services">
      <div className="section-heading">
        <p>What I do</p>
        <h2>My Services</h2>
      </div>

      {isAdmin && (
        <div className="project-toolbar">
          <button onClick={resetServices}>Reset demo data</button>
          <button className="btn-primary" onClick={openAddForm}>+ Add Service</button>
        </div>
      )}

      <div className="services-container">
        {services.map((service) => (
          <div className="service-card" key={service.id}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            {isAdmin && (
              <div className="project-card-actions">
                <button onClick={(e) => openEditForm(service, e)}>Edit</button>
                <button className="btn-delete" onClick={(e) => handleDelete(service, e)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {formOpen && (
        <ServiceForm
          service={editingService}
          onSave={handleSave}
          onCancel={() => {
            setFormOpen(false);
            setEditingService(null);
          }}
        />
      )}
    </Reveal>
  );
}
