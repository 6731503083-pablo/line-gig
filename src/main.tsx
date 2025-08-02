import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import liff from "@line/liff";

// Initialize LIFF
const initializeApp = async () => {
  try {
    await liff.init({
      liffId: "2007867086-Pm46mpyZ",
    });

    // Render the React app
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <App />
      </StrictMode>
    );

    console.log("✅ Application initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize application:", error);

    // Still render the app even if LIFF fails (for development)
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
};

// Start the application
initializeApp();
