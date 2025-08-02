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
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white",
        fontSize: "24px",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#06C755",
          fontSize: "36px",
          fontWeight: "bold",
          width: "100%",
          textAlign: "center",
          padding: "20px 0",
          borderRadius: "5px",
          fontFamily: "'Arial', sans-serif",
        }}
      >
        LINE GIG
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          textAlign: "center",
          fontSize: "18px",
        }}
      >
        <div
          style={{
            backgroundColor: "#06C755",
            padding: "15px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            fontFamily: "'Arial', sans-serif",
          }}
          onClick={() => handleButtonClick("employer")}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.color = "#06C755";
            e.currentTarget.style.border = "1px solid #06C755";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#06C755";
            e.currentTarget.style.color = "white";
            e.currentTarget.style.border = "1px solid white";
          }}
        >
          Create Job Offers
        </div>
        <div
          style={{
            border: "1px solid #06C755",
            padding: "15px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            fontFamily: "'Arial', sans-serif",
            color: "#06C755",
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
