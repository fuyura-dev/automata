const { runPython } = require("./utils/pythonBridge");

const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());

const rootWordsPath = path.join(__dirname, "data", "root_words.json");

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

  if (!word) {
    return res.status(400).json({ error: "error input" });
  }

  res.json({
    input: word,
    root: "root test",
    affixes: ["affix 1", "affix 2"],
    valid: true,
  });
});

app.get("/", (req, res) => {
  res.send("Hello Hello");
});

app.get("/test", async (req, res) => {
  try {
    const result = await runPython("external/test/test.py", ["adfasf"]);

    res.json({ output: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
