// src/App.jsx
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "@/context/AuthContext";
import { OnboardingProvider } from "@/context/OnboardingContext";
import ScrollToTop from "./components/common/ScrollToTop";
import AppRoutes from "./routes";
import { Toaster } from "react-hot-toast"; // Thêm dòng này
import "leaflet/dist/leaflet.css";

function App() {
  return (
    <AuthContextProvider>
      <OnboardingProvider>
        <BrowserRouter>
        <ScrollToTop />
          <AppRoutes />
        </BrowserRouter>
      </OnboardingProvider>
    </AuthContextProvider>
  );
}

export default App;
