import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/index";

function App() {
  return (
    <Routes>
      {/* Default (home) */}
      <Route path="/index" element={<Index />} />
    </Routes>
  );
}
export default App;
