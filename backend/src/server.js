const { try_match, produce_rootword } = require("core");
const { validateInput } = require("./utils/validate");

const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());

const rootWordsPath = path.join(
  __dirname,
  "..",
  "..",
  "core",
  "src",
  "data",
  "root_words.json"
);

app.get("/api/roots", (req, res) => {
  try {
    let data = fs.readFileSync(rootWordsPath, "utf8");

    if (data.charCodeAt(0) === 0xfeff) {
      data = data.slice(1);
    }

    const jsonData = JSON.parse(data);
    res.json(jsonData);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to read file", details: err.message });
  }
});

app.post("/api/analyze", (req, res) => {
  const { word } = req.body;

  const validation = validateInput(word);
  if (!validation.ok) {
    return res.status(400).json({
      valid: false,
      error: validation.error,
    });
  }

  const input = validation.value;

  const result = try_match(input);

  if (!result) {
    return res.json({
      components: [{ str: word, kind: "root" }],
      valid: false,
    });
  }

  const { rule, components, root } = result;

  res.json({
    root,
    components,
    valid: true,
    form: rule.aux_data.form,
  });
});

app.get("/", (req, res) => {
  res.send("Hello Hello");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
