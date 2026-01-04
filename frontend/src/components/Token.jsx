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

export default Token;
