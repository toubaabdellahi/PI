import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../style.css";

function Home() {
  const navigate = useNavigate();

  // Références pour le scroll
  const homeRef = useRef(null);
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  // Fonction pour scroller vers une section
  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="app">
      {/* Barre de navigation */}
      <nav className="navbar">
        <div className="logo">SubstanceAi</div>
        <div className="nav-links">
          <a href="#home" onClick={() => scrollToSection(homeRef)}>
            Accueil
          </a>
          <a href="#features" onClick={() => scrollToSection(featuresRef)}>
            Fonctionnalités
          </a>
          <a href="#about" onClick={() => scrollToSection(aboutRef)}>
            À propos
          </a>
          <a href="#contact" onClick={() => scrollToSection(contactRef)}>
            Contacts
          </a>
        </div>
        <div className="auth-buttons">
          <button className="login-btn" onClick={() => navigate("/login")}>
            Log In
          </button>
          <button className="signup-btn" onClick={() => navigate("/sign-up")}>
            Sign up
          </button>
        </div>
      </nav>

      {/* Sections de la page */}
      <section ref={homeRef} className="hero-section">
        <h1>Welcome to the Substance AI</h1>
        <p>
          SubstancIA révolutionne l'apprentissage en ligne en sélectionnant les
          meilleures ressources pour vous, les organisant en parcours sur mesure
          et intégrant des éléments de gamification. Découvrez une expérience
          éducative immersive, efficace, et parfaitement adaptée à vos besoins.
        </p>
        <div className="cta-buttons">
          <button className="demo-btn">Request a demo</button>
          <button className="video-btn">Watch video</button>
        </div>
      </section>

      <section ref={featuresRef} className="section">
        <h2>Fonctionnalités</h2>
        <p>Contenu des fonctionnalités...</p>
      </section>

      <section ref={aboutRef} className="section">
        <h2>À propos</h2>
        <p>Contenu à propos...</p>
      </section>

      <section ref={contactRef} className="section">
        <h2>Contacts</h2>
        <p>Contenu des contacts...</p>
      </section>
    </div>
  );
}

export default Home;
