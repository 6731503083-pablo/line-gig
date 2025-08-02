import liff from "@line/liff";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [employersData, setEmployersData] = useState<any[]>([]);
  const [apiStatus, setApiStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleButtonClick = (type: "employer" | "freelancer") => {
    navigate("/login", { state: { type } });
  };

  useEffect(() => {
    if (liff.isLoggedIn()) {
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

    // Test API call
    const testAPI = async () => {
      try {
        setApiStatus('loading');
        const response = await fetch("https://testing-json-server-vercel.vercel.app/employers");
        const data = await response.json();
        console.log("API Test - Employers data:", data);
        setEmployersData(data);
        setApiStatus('success');
      } catch (error) {
        console.error("API Test - Failed to fetch employers:", error);
        setApiStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      }
    };
    testAPI();
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
      <h1
        style={{
          color: "#06C755",
          fontSize: "36px",
          fontWeight: "bold",
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "2px",
          margin: "0",
          fontFamily: "'Arial', sans-serif",
        }}
      >
        {liff.isLoggedIn() ? "Welcome Back!" : "Welcome to LINE GIG"}
      </h1>

      {/* API Testing UI */}
      <div style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        padding: "20px",
        borderRadius: "10px",
        width: "90%",
        maxWidth: "600px",
        textAlign: "center"
      }}>
        <h3 style={{ color: "#06C755", margin: "0 0 15px 0" }}>API Test Status</h3>
        
        {apiStatus === 'loading' && (
          <div style={{ color: "#FFD700" }}>Loading employers data...</div>
        )}
        
        {apiStatus === 'success' && (
          <div>
            <div style={{ color: "#00FF00", marginBottom: "10px" }}>
              ✅ API Working! Found {employersData.length} employers
            </div>
            <div style={{ 
              backgroundColor: "rgba(0, 0, 0, 0.2)", 
              padding: "10px", 
              borderRadius: "5px",
              fontSize: "14px",
              textAlign: "left",
              maxHeight: "150px",
              overflowY: "auto"
            }}>
              <pre>{JSON.stringify(employersData, null, 2)}</pre>
            </div>
          </div>
        )}
        
        {apiStatus === 'error' && (
          <div>
            <div style={{ color: "#FF6B6B", marginBottom: "10px" }}>
              ❌ API Error: {errorMessage}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                backgroundColor: "#06C755",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Retry
            </button>
          </div>
        )}
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
