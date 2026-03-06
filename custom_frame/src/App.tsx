import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Splash from "./pages/Splash";
import Login from "./pages/Login/Login";
import Join from "./pages/Join/Join";
import Custom1 from "./pages/custom/Custom1";
import Photo from "./pages/photo/Photo";
import Custom2 from "./pages/custom/Custom2";
import Photo1 from "./pages/custom/Photo1";
import TakePhoto from "./pages/photo/Takephoto";

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
      <Route path="/custom1" element={<Custom1 />}/>
      <Route path="/custom2" element={<Custom2 />}/>
      <Route path="/photo1" element={<Photo />}/>
      <Route path="/customphoto1" element={<Photo1 />}/>
      <Route path="/takephoto" element={<TakePhoto />}/>
    </Routes>
  );
}

export default App;
