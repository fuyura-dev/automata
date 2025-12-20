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
