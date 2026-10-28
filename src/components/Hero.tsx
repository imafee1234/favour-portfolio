import { useTypewriter } from "../hooks/useTypewriter.js";

export default function Hero() {
  const typedRole = useTypewriter("Software Engineer & Digital Creative", 45);

  return (
    <section id="home">
      <p>Hello, I'm</p>
      <h1>Imafidor Divinefavour</h1>
      <h2>
        {typedRole}
        <span className="cursor" aria-hidden="true">|</span>
      </h2>

      <p>
        I build digital experiences, applications and visual designs
        that solve real-world problems.
      </p>

      <a href="#projects">View My Work</a>
      <a href="#contact">Let's Work Together</a>
    </section>
  );
}
