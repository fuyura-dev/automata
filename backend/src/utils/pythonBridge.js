const { spawn } = require("child_process");
const path = require("path");

function runPython(scriptRelativePath, args = []) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "../../..", scriptRelativePath);

    const python = spawn("python", [scriptPath, ...args]);

    let output = "";
    let error = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.on("close", (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(
          new Error(`Python script exited with code ${code}: ${error.trim()}`)
        );
      }
    });
  });
}

module.exports = { runPython };
