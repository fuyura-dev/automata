import { useState, useEffect } from "react";

import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [components, setComponents] = useState([])
  const [loading, setLoading] = useState(false);

  const fetchApi = async (word) => {
    return await fetch('/api/analyze', {
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

    setComponents(result.components.map(({str, kind}, i) => {
      if (kind == 'redup') {
        return <span className="blue" key={i}> {str} </span>
      } else if (kind == 'root') {
        return <span className={result.valid ? "green" : "red"} key={i}> {str} </span>
      } else {
        return <span className="affix" key={i}> {str} </span>
      }
    }))

    setLoading(false);
  }

  const onKeyDown = (e) => {
    const key = e.key;
    console.log(key)
    if (key.length == 1) {
      handleInputChange(input + key);           // TODO if not a-z A-Z - , ignore if.  A_Z lowercase it
    }
    if (key == "Backspace") {
      handleInputChange(input.slice(0, input.length - 1));
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown)
  });

  return (
    <div className="input-div">
      {loading ? <span class="yellow">{input}</span> : components}
    </div>
  );
}

export default App;