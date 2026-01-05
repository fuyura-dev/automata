import { useNavigate } from "react-router";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <Hero />
      <HowItWorks />
    </div>
  );
}

export default Landing;
