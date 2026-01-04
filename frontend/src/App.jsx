import { Routes, Route } from "react-router";

import Analyzer from "./pages/Analyzer";
import Landing from "./pages/Landing";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/analyze" element={<Analyzer />} />
    </Routes>
  );
}

export default App;
