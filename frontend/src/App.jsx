import { useState, useEffect } from "react";

import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [components, setComponents] = useState([])
  const [loading, setLoading] = useState(false);

  const fetchApi = async (word) => {
    const API_URL = import.meta.env.VITE_API_URL || '';
    return await fetch(`${API_URL}/api/analyze`, {
      method: "POST",
      body: JSON.stringify({"word": word}),
      headers: {
        "Content-Type": "application/json"
      }
    })
  }

  const handleInputChange = async (newInput) => {
    setInput(newInput);
    setLoading(true);
    const response = await fetchApi(newInput);

    const result = await response.json();

    if (result.components) {
      setComponents(result.components.map(({str, kind}, i) => {
        if (kind == 'redup') {
          return <span className="blue" key={i}> {str} </span>
        } else if (kind == 'root') {
          return <span className={result.valid ? "green" : "red"} key={i}> {str} </span>
        } else {
          return <span className="affix" key={i}> {str} </span>
        }
      }))
    } else {
      setComponents([])
    }
    setLoading(false);
  }

  const onKeyDown = (e) => {
    const key = e.key;
    console.log(key)
    if (key == "Backspace") {
      handleInputChange(input.slice(0, input.length - 1));
    }
    if (key.length != 1) {
      return;
    }
    if (!/^[a-zA-Z]$/.test(key)) {
      return;
    }

    handleInputChange(input + key.toLowerCase())
  }

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown)
  });

  return (
    <div className="input-div">
      {loading ? <span className="yellow">{input}</span> : components}
    </div>
  );
}

export default App;