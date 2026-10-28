import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import BackToTop from "./components/BackToTop";
import { AdminProvider } from "./context/AdminContext";

export default function App() {
  return (
    <AdminProvider>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <BackToTop />
    </AdminProvider>
  );
}
