// src/App.jsx
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import ScrollToTop from "./components/common/ScrollToTop";
import AppRoutes from "./routes";
import { Toaster } from "react-hot-toast"; // Thêm dòng này
import "leaflet/dist/leaflet.css";

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
      <ScrollToTop />
        <AppRoutes />
        <Toaster position="top-right" reverseOrder={false} /> {/* Thêm dòng này */}
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
