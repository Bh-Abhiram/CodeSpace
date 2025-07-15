const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { spawn, exec } = require("child_process");

const tempDir = path.join(__dirname, "../temp");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

const gccPath = "C:/Program Files (x86)/Dev-Cpp/MinGW64/bin/gcc.exe";
const gppPath = "C:/Program Files (x86)/Dev-Cpp/MinGW64/bin/g++.exe";

router.post("/execute", async (req, res) => {
  const { code, language, input } = req.body;
  const id = `code_${Date.now()}`;
  const extMap = {
    c: "c",
    cpp: "cpp",
    python: "py",
    java: "java",
    javascript: "js",
  };

  const ext = extMap[language];
  if (!ext) return res.status(400).json({ output: "Unsupported language" });

  const filePath = path.join(tempDir, `${id}.${ext}`);
  const inputPath = path.join(tempDir, `${id}_input.txt`);
  const exePath = path.join(tempDir, `${id}.exe`);

  fs.writeFileSync(filePath, code);
  if (input) fs.writeFileSync(inputPath, input);

  let command;

  switch (language) {
    case "c":
      command = `"${gccPath}" "${filePath}" -o "${exePath}" && "${exePath}"`;
      if (input) command += ` < "${inputPath}"`;
      break;

    case "cpp":
      command = `"${gppPath}" "${filePath}" -o "${exePath}" && "${exePath}"`;
      if (input) command += ` < "${inputPath}"`;
      break;

    case "python": {
      const python = spawn("python", [filePath]);

      if (input) {
        python.stdin.write(input);
        python.stdin.end();
      }

      let output = "";
      let error = "";

      python.stdout.on("data", (data) => {
        output += data.toString();
      });

      python.stderr.on("data", (data) => {
        error += data.toString();
      });

      python.on("close", (code) => {
        if (code !== 0 || error) {
          return res.json({ output: error || "Execution error." });
        }
        return res.json({ output: output.trim() });
      });

      return; 
    }

    case "java": {
      const match = code.match(/public\s+class\s+(\w+)/);
      const className = match ? match[1] : `Main${Date.now()}`;
      const javaFilePath = path.join(tempDir, `${className}.java`);
      fs.writeFileSync(javaFilePath, code);

      command = `javac "${javaFilePath}" && java -cp "${tempDir}" ${className}`;
      if (input) command += ` < "${inputPath}"`;
      break;
    }

    case "javascript":
      command = `node "${filePath}"`;
      if (input) command += ` < "${inputPath}"`;
      break;
  }

  exec(command, { cwd: tempDir }, (err, stdout, stderr) => {
    if (err) {
      return res.json({ output: stderr || "Execution error." });
    }

    const formatted = input
      ? `---INPUT---\n${input.trim()}\n---OUTPUT---\n${stdout.trim()}`
      : stdout.trim();

    res.json({ output: formatted });
  });
});

module.exports = router;
