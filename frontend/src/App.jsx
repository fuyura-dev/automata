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

const formatForm = (form) => {
  if (!form) return null;

  const values = Array.isArray(form) ? form : [form];

  return values
    .map((f) => f.replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(", ");
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

const API_URL = import.meta.env.VITE_API_URL || "";

function App() {
  const [input, setInput] = useState("");
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceTimerRef = useRef(null);
  const [isValid, setIsValid] = useState(false);
  const [form, setForm] = useState([]);
  const [roots, setRoots] = useState([]);
  const [showRoots, setShowRoots] = useState(false);
  const [rootsLoading, setRootsLoading] = useState(false);
  const otherFormsRef = useRef([]);
  const [hasOther, setHasOther] = useState(false);

  const fetchApi = async (word) => {
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
    otherFormsRef.current = result.other ?? [];
    setHasOther(result.other.length > 0);
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
    if (otherFormsRef.current.length > 0) {
      if (key == "ArrowLeft") {
        handleInputChange(otherFormsRef.current[0]);
        return;
      }
      if (key == "ArrowRight") {
        handleInputChange(otherFormsRef.current[1]);
        return;
      }
    }
    if (key.length != 1) {
      return;
    }
    if (!/^[a-zA-Z]$/.test(key)) {
      return;
    }

    handleInputChange(currentInput + key.toLowerCase());
  };

  const formattedForm = formatForm(form);
  const resultForm = input
    ? formattedForm
      ? `Form: ${formattedForm}`
      : "Invalid"
    : "";

  const fetchRoots = async () => {
    if (roots.length > 0) return;

    setRootsLoading(true);
    const response = await fetch(`${API_URL}/api/roots`);
    const result = await response.json();

    const sortedRoots = (result.words || []).slice().sort();

    setRoots(sortedRoots);
    setRootsLoading(false);
  };
  useEffect(() => {
    fetchRoots();
  }, []);

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
    <div>
      <div className="key-hints">
        <div className="key-hint">
          <span className="key">Enter ↵</span>
          <span className="hint-label">Quick Analyze</span>
        </div>

        <div className="key-hint">
          <span className="key">⌫</span>
          <span className="hint-label">Delete letter</span>
        </div>

        <div className="key-hint">
          <span className="key">DEL</span>
          <span className="hint-label">Clear</span>
        </div>

        {hasOther && (
          <>
            <div className="key-hint">
              <span className="key">←</span>
              <span className="hint-label">Previous Form</span>
            </div>
            <div className="key-hint">
              <span className="key">→</span>
              <span className="hint-label">Next Form</span>
            </div>
          </>
        )}
      </div>

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
      <button
        className="show-roots-btn"
        onClick={() => {
          if (!showRoots) fetchRoots();
          setShowRoots((prev) => !prev);
        }}
      >
        {showRoots ? "Hide roots" : "Show roots"}
      </button>
      {showRoots && (
        <div className="roots-panel">
          {rootsLoading ? (
            <div className="roots-loading">Loading roots…</div>
          ) : (
            <div className="roots-list">
              {roots.map((root, i) => (
                <span key={i} className="root-item">
                  {root}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
