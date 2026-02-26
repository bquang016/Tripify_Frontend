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
          {/* Cấu hình Toaster toàn cục với z-index cực cao để không bị che bởi Modal */}
          <Toaster 
            position="top-right"
            containerStyle={{
              zIndex: 99999,
            }}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </BrowserRouter>
      </OnboardingProvider>
    </AuthContextProvider>
  );
}

export default App;
