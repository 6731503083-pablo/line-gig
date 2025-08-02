import liff from "@line/liff";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleButtonClick = (type: "employer" | "freelancer") => {
    if (liff.isLoggedIn() && liff.isInClient()) {
      localStorage.setItem("userType", type);
      navigate("/feeds");
    } else {
      navigate("/login", { state: { type } });
    }
  };

  useEffect(() => {
    if (liff.isLoggedIn() && !liff.isInClient()) {
      navigate("/feeds");
      return;
    }
    const userLineProfile = async () => {
      const data = await liff.getProfile();
      console.log("User Profile:", data);
    };
    userLineProfile().catch((error) => {
      console.error("Failed to get LINE profile:", error);
    });

  
  }, [navigate]);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        padding: "5vw",
        gap: "8vh",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          backgroundColor: "#06C755",
          fontSize: "clamp(24px, 8vw, 48px)",
          fontWeight: "bold",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
          padding: "4vw 2vw",
          borderRadius: "12px",
          fontFamily: "'Arial', sans-serif",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        LINE GIG
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4vw",
          textAlign: "center",
          fontSize: "clamp(14px, 4vw, 18px)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <div
          style={{
            backgroundColor: "#06C755",
            padding: "4vw 6vw",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            fontFamily: "'Arial', sans-serif",
            fontWeight: "600",
            width: "100%",
            boxSizing: "border-box",
            border: "2px solid transparent",
            minHeight: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => handleButtonClick("employer")}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.color = "#06C755";
            e.currentTarget.style.border = "2px solid #06C755";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#06C755";
            e.currentTarget.style.color = "white";
            e.currentTarget.style.border = "2px solid transparent";
          }}
        >
          Create Job Offers
        </div>
        <div
          style={{
            border: "2px solid #06C755",
            padding: "4vw 6vw",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            fontFamily: "'Arial', sans-serif",
            fontWeight: "600",
            color: "#06C755",
            backgroundColor: "transparent",
            width: "100%",
            boxSizing: "border-box",
            minHeight: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => handleButtonClick("freelancer")}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#06C755";
            e.currentTarget.style.color = "white";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#06C755";
          }}
        >
          Find Job Offers
        </div>
      </div>
    </div>
  );
}

export default Home;
