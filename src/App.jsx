// Compatibility shim: `src/main.jsx` (the Vite entry point) imports this path.
// The canonical app root lives in `src/app/App.jsx`, so this file only
// re-exports it — there is a single App implementation in the project.
// The global stylesheet is also imported here so the app entry owns it;
// `src/main.jsx` imports the same module, and bundlers include it once.
import './index.css'
import App from './app/App.jsx'

export default App
