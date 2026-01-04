import { useNavigate } from "react-router";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/analyze")}>
      Start
    </button>
  );
}
