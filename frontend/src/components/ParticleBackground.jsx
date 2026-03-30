import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const ParticleBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
      options={{
        background: {
          color: {
            value: "#070825", // ¡Aquí aplicamos el color principal de fondo!
          },
        },
        particles: {
          number: { value: 355, density: { enable: true, value_area: 789.15 } },
          color: { value: "#ffffff" },
          shape: { type: "circle" },
          opacity: { value: 0.49, anim: { enable: true, speed: 0.40, opacity_min: 0 } },
          size: { value: 2, random: true, anim: { enable: true, speed: 0.333, size_min: 0 } },
          line_linked: { enable: false },
          move: { enable: true, speed: 0.1, direction: "none", random: true, out_mode: "out" }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "bubble" },
            onclick: { enable: true, mode: "push" },
            resize: true
          },
          modes: {
            bubble: { distance: 83.9, size: 1, duration: 3, opacity: 1, speed: 3 },
            push: { particles_nb: 4 }
          }
        },
        retina_detect: true
      }}
    />
  );
};

export default ParticleBackground;