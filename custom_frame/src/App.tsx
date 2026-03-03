import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Splash from "./pages/Splash";
import Login from "./pages/Login/Login";
import Join from "./pages/Join/Join";

function App() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Splash />} />

      {/* Optional: keep /index working */}
      <Route path="/index" element={<Index />} />

      {/* Fallback: any unknown path -> home */}
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/login" element={<Login />}/>
      <Route path="/join" element={<Join />}/>
    </Routes>
  );
}

export default App;
