export const formatForm = (form, input) => {
  if (!input) return "";
  if (!form) return "Invalid";

  const values = Array.isArray(form) ? form : [form];

  const formatted = values
    .map((f) => f.replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(", ");
  return `Form: ${formatted}`;
};
