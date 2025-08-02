import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import LoginPage from "./LoginPage";
import { FeedsPage } from "./FeedsPage";
import OfferPage from "./components/OfferPage";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/feeds" element={<FeedsPage />} />
          <Route path="/offers" element={<OfferPage />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
