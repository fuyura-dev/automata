import { useState } from "react";

import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [word, setWord] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);

    const response = await fetch('/api/analyze', {
      method: "POST",
      body: JSON.stringify({"word": input}),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await response.json();

    setWord(input);
    setResult({
      input: input,
      root: result.root,
      affixes: ["affix1", "affix2"],
      valid: true,
    });

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">
          Filipino Verb Analyzer
        </h1>

        <input
          className="w-full border rounded px-3 py-2 mb-3 text-black"
          placeholder="Enter a Filipino verb"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleAnalyze}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>

        {result && (
          <div className="mt-4 border-t pt-4 text-black">
            <p>
              <strong>Input: </strong> {word}
            </p>
            <p>
              <strong>Root: </strong>
              {result.root}
            </p>
            <p>
              <strong>Affixes: </strong>
              {result.affixes.join(", ")}
            </p>
            <p>
              <strong>Valid: </strong>
              {result.valid ? "Yes" : "No"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
