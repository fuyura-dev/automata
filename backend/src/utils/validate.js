function validateInput(input) {
  if (typeof input !== "string") {
    return { ok: false, error: "Input must be a string." };
  }

  const normalized = input.trim().toLowerCase();

  if (normalized.length === 0) {
    return { ok: false, error: "Input cannot be empty." };
  }

  if (normalized.length > 32) {
    return { ok: false, error: "Input is too long." };
  }

  if (!/^[a-z]+$/.test(normalized)) {
    return { ok: false, error: "Input contains invalid characters." };
  }

  return { ok: true, value: normalized };
}

module.exports = { validateInput };
