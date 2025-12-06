const { runPython } = require("./utils/pythonBridge");

const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
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
