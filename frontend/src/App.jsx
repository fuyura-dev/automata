import { useState, useEffect, useRef } from "react";

import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceTimerRef = useRef(null);

  const fetchApi = async (word) => {
    const API_URL = import.meta.env.VITE_API_URL || "";
    return await fetch(`${API_URL}/api/analyze`, {
      method: "POST",
      body: JSON.stringify({ word: word }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const analyeWord = async (word) => {
    const response = await fetchApi(word);

    const result = await response.json();

    if (result.components) {
      setComponents(
        result.components.map(({ str, kind }, i) => {
          if (kind == "redup") {
            return (
              <span className="blue" key={i}>
                {" "}
                {str}{" "}
              </span>
            );
          } else if (kind == "root") {
            return (
              <span className={result.valid ? "green" : "red"} key={i}>
                {" "}
                {str}{" "}
              </span>
            );
          } else {
            return (
              <span className="affix" key={i}>
                {" "}
                {str}{" "}
              </span>
            );
          }
        })
      );
    } else {
      setComponents([]);
    }
    setLoading(false);
  };

  const handleInputChange = (newInput) => {
    console.log("Input changed:", newInput);
    setInput(newInput);
    setLoading(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      console.log("Analyzing:", newInput);

      analyeWord(newInput);
    }, 600);
  };
  const inputRef = useRef("");
  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  const onKeyDown = (e) => {
    const key = e.key;
    console.log("Key pressed:", key);

    const currentInput = inputRef.current;

    if (key == "Backspace") {
      handleInputChange(currentInput.slice(0, currentInput.length - 1));
      return;
    }
    if (key.length != 1) {
      return;
    }
    if (!/^[a-zA-Z]$/.test(key)) {
      return;
    }

    handleInputChange(currentInput + key.toLowerCase());
  };

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="input-div">
      {loading ? <span className="yellow">{input}</span> : components}
    </div>
  );
}

export default App;
