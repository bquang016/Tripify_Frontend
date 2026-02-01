// src/App.jsx
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import ScrollToTop from "./components/common/ScrollToTop";
import AppRoutes from "./routes";
import "leaflet/dist/leaflet.css";

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
      <ScrollToTop />
        <AppRoutes />
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
