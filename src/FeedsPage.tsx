import liff from "@line/liff";
import { useLocation, useNavigate } from "react-router-dom";

export const FeedsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const type = localStorage.getItem("userType") || (location.state as { type?: string })?.type;
  
  return (
    <div style={{ 
      padding: "20px", 
      fontFamily: "'Arial', sans-serif", 
      color: "white",
      minHeight: "100vh",
      backgroundColor: "#06C755",

    }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "30px" 
      }}>
        <h1 style={{ margin: 0, fontSize: "24px" }}>LINE GIG Feeds</h1>
        <button
          onClick={() => navigate("/profile")}
          style={{
            backgroundColor: "#06C755",
            border: "none",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            fontFamily: "'Arial', sans-serif",
          }}
        >
          Profile
        </button>
      </div>
      
      <div style={{ marginBottom: "20px" }}>
        <strong>User Type:</strong> {type}
      </div>
      
      <div 
        onClick={() => {
          liff.logout();
          localStorage.removeItem("userType");
          navigate("/");
        }}
        style={{
          backgroundColor: "#ff4444",
          color: "white",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
          display: "inline-block",
          fontFamily: "'Arial', sans-serif",
        }}
      >
        Log Out
      </div>
    </div>
  );
};
