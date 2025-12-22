# Transformation Rules Syntax Highlighting

This VSCode extension provides syntax highlighting for `.rules` files used in the Filipino Verb Analyzer project.

## Features

- Syntax highlighting for transformation rule files
- Support for:
  - Variables (`C`, `V`, `R`)
  - Affixes (quoted strings)
  - Arrow operators (`->`)
  - JSON metadata
  - Line comments (`//`)

## Installation

### From Source

1. Copy the `.vscode-extension` directory to your VSCode extensions folder:
   - **Windows**: `%USERPROFILE%\.vscode\extensions\transformation-rules-syntax`
   - **macOS/Linux**: `~/.vscode/extensions/transformation-rules-syntax`

2. Restart VSCode

### From VSIX (if packaged)

1. Install `vsce` if you haven't:
   ```bash
   npm install -g @vscode/vsce
   ```

2. Package the extension:
   ```bash
   cd .vscode-extension
   vsce package
   ```

3. Install the generated `.vsix` file:
   - Open VSCode
   - Go to Extensions view (Ctrl+Shift+X / Cmd+Shift+X)
   - Click on the "..." menu at the top
   - Select "Install from VSIX..."
   - Choose the generated `.vsix` file

## Usage

Once installed, the extension will automatically provide syntax highlighting for any file with the `.rules` extension.

## Syntax Overview

The transformation rules syntax includes:

- **Variables**: `C` (Consonant), `V` (Vowel), `R` (Root/Variable)
- **Affixes**: Quoted strings like `"um"`, `"mag"`, `"in"`
- **Arrow operator**: `->` separates the derivation from production
- **Separator**: `.` separates the production from metadata
- **Metadata**: JSON object containing rule properties like `{"form": "infinitive"}`
- **Comments**: Line comments starting with `//`

### Example

```
C "um" V R -> C V R . {"form": ["infinitive", "completed"] } // tumakbo
```

## License

ISC
