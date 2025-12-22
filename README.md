## Installation

1. **Clone the repository**

   ```sh
   git clone https://github.com/fuyura-dev/automata.git
   cd automata
   ```

2. **Install root dependencies**

   ```sh
   npm install
   ```

3. **Install backend dependencies**

   ```sh
   cd backend
   npm install
   cd ..
   ```

4. **Install frontend dependencies**
   ```sh
   cd frontend
   npm install
   cd ..
   ```

## Running the Application

From the root directory, run:

```sh
npm run dev
```

This will start both the backend server and frontend development server concurrently.

### Run Backend Only

```sh
cd backend
npm start
```

### Run Frontend Only

```sh
cd frontend
npm run dev
```

## Development

- **Backend** - The Node.js server runs on `http://localhost:3000`
- **Frontend** - The Vite dev server runs on `http://localhost:5173`

Make sure both servers are running for the application to work properly.

## VSCode Extension

This repository includes a VSCode extension for syntax highlighting of `transformation.rules` files.

### Installing the Extension

1. **From VSIX (Recommended)**

   The extension has been packaged and is available in the `.vscode-extension` directory.

   To install:
   - Open VSCode
   - Go to Extensions view (Ctrl+Shift+X / Cmd+Shift+X)
   - Click on the "..." menu at the top
   - Select "Install from VSIX..."
   - Navigate to `.vscode-extension/transformation-rules-syntax-0.0.1.vsix`
   - Select the file to install

2. **From Source**

   Copy the `.vscode-extension` directory to your VSCode extensions folder:
   - **Windows**: `%USERPROFILE%\.vscode\extensions\transformation-rules-syntax`
   - **macOS/Linux**: `~/.vscode/extensions/transformation-rules-syntax`

   Then restart VSCode.

### Rebuilding the Extension

If you make changes to the extension:

```sh
cd .vscode-extension
npx @vscode/vsce package
```

This will generate a new `.vsix` file that can be installed in VSCode.
