import { useState, useEffect, useRef } from "react";

import "./App.css";

const KIND_INFO = {
  redup: {
    label: "Reduplication",
    desc: "Reduplication desc",
  },
  affix: {
    label: "Affix",
    desc: "Affix desc",
  },
  root: {
    label: "Root",
    desc: "Root desc",
  },
};

function Token({ str, kind, valid }) {
  const info =
    kind == "root" && !valid
      ? { label: "Invalid", desc: "" }
      : KIND_INFO[kind] || { label: kind, desc: "" };

  let className = "affix";
  if (kind === "redup") className = "blue";
  if (kind === "root") className = valid ? "green" : "red";

  return (
    <span className="token-wrapper">
      <span className={`token ${className}`}>{str}</span>

      <span className="tooltip">
        <strong>{info.label}</strong>
        <div className="tooltip-desc">{info.desc}</div>
      </span>
    </span>
  );
}

function App() {
  const [input, setInput] = useState("");
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceTimerRef = useRef(null);
  const [isValid, setIsValid] = useState(false);
  const [form, setForm] = useState([]);

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
      setComponents(result.components);
      setForm(result.form);
      console.log(result.form);
      setIsValid(result.valid);
    } else {
      setComponents([]);
      setForm("");
      setIsValid(false);
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
    if (key == "Delete") {
      handleInputChange("");
      return;
    }
    if (key == "Enter") {
      analyeWord(currentInput);
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

  const resultForm =
    input && form !== undefined ? "Form: " + form : input ? "invalid" : "";
  console.log("resultForm:", resultForm);

  return (
    <div>
      <div className="input-div">
        {loading ? (
          <span className="yellow">{input}</span>
        ) : (
          components.map((c, i) => (
            <Token key={i} str={c.str} kind={c.kind} valid={isValid} />
          ))
        )}
      </div>
      <div className="form-div">
        {loading || resultForm == "" ? (
          <span></span>
        ) : (
          <span>{resultForm}</span>
        )}
      </div>
    </div>
  );
}

export default App;
