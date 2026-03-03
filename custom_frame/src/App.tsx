import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Splash from "./pages/Splash";

function App() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Splash />} />

      {/* Optional: keep /index working */}
      <Route path="/index" element={<Index />} />

      {/* Fallback: any unknown path -> home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
