import { useEffect, useState } from "react";

export interface Service {
  id: string;
  title: string;
  description: string;
}

const STORAGE_KEY = "portfolio_services";

const defaultServices: Service[] = [
  { id: "sv1", title: "Web Development", description: "I create responsive and user-friendly websites using modern web technologies." },
  { id: "sv2", title: "Mobile App Development", description: "I build mobile applications with a focus on usability and functionality." },
  { id: "sv3", title: "UI/UX Design", description: "I design clean and intuitive interfaces that provide a better user experience." },
  { id: "sv4", title: "Graphic Design", description: "I create flyers, social media graphics and other digital visual content." },
  { id: "sv5", title: "Branding", description: "I create visual identities including logos, colors and other brand materials." },
  { id: "sv6", title: "IT Support", description: "I provide technical assistance with software, systems and general IT-related tasks." },
];

function loadServices(): Service[] {
  if (typeof window === "undefined") return defaultServices;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultServices;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultServices;
  } catch {
    return defaultServices;
  }
}

export function useLocalServices() {
  const [services, setServices] = useState<Service[]>(loadServices);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
    } catch {
      // ignore storage failures
    }
  }, [services]);

  const addService = (service: Service) => {
    setServices((prev) => [...prev, service]);
  };

  const updateService = (id: string, updated: Service) => {
    setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const resetServices = () => setServices(defaultServices);

  return { services, addService, updateService, deleteService, resetServices };
}