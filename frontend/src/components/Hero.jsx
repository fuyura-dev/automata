import logo from "../assets/logo.svg";
import { useNavigate } from "react-router";

function Hero() {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    document.getElementById("how")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="hero">
      <div className="hero-left">
        <p className="hero-tagline">
          Analyze <span className="yellow">Filipino</span>{" "}
          <span className="green">Words</span> Instantly
        </p>

        <h1 className="hero-title">FiVerba</h1>

        <button className="hero-btn" onClick={() => navigate("/analyze")}>
          Start
        </button>

        <p className="hero-hint" onClick={scrollToHowItWorks}>
          See how it works
        </p>
      </div>

      <div className="hero-right">
        <img src={logo} />
      </div>
    </div>
  );
}

export default Hero;
