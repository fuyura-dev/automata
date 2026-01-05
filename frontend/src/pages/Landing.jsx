import { useNavigate } from "react-router";
import Hero from "../components/Hero";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <Hero />
    </div>
  );
}

export default Landing;
