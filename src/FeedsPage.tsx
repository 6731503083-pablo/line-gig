// import liff from "@line/liff";
import { useNavigate } from "react-router-dom";
// useLocation, 

export const FeedsPage = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  // const type = localStorage.getItem("userType") || (location.state as { type?: string })?.type;
  
  return (
    <div style={{ 
      fontFamily: "'Arial', sans-serif", 
      color: "white",
      minHeight: "100vh",
      width: "100%",
      backgroundColor: "#06C755",
      display: "flex",
      flexDirection: "column",
      position: "relative",
    }}>
      {/* Top Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        padding: "20px",
        paddingBottom: "30px"
      }}>
        <h1 
        style={{ 
          margin: 0, 
          fontSize: "24px",
          fontWeight: "bold"
          }}
          >LINE GIG Feeds</h1>
      </div> 

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        padding: "20px",
        paddingBottom: "100px", // Space for bottom bar
        backgroundColor: "#fff",
        color: "#333",
      }}>
        {/* Your main feeds content will go here */}
        <p>Main content area for feeds...</p>
      </div>

      {/* Bottom App Bar - Sticky */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        padding: "15px 20px",
        backgroundColor: "#fff",
        borderTop: "1px solid #eee",
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
      }}>
        <div 
        onClick={() => navigate("/offers")}
        style={{
          backgroundColor: "#06C755",
          color: "white",
          padding: "12px 24px",
          borderRadius: "25px",
          cursor: "pointer",
          fontFamily: "'Arial', sans-serif",
          fontWeight: "600",
          flex: 1,
          textAlign: "center",
          maxWidth: "150px",
        }}
      >
        Offers
      </div>
      <div
      onClick={() => navigate("/profile")}
          style={{
            backgroundColor: "#06C755",
            color: "white",
            padding: "12px 24px",
            borderRadius: "25px",
            cursor: "pointer",
            fontFamily: "'Arial', sans-serif",
            fontWeight: "600",
            flex: 1,
            textAlign: "center",
            maxWidth: "150px",
          }}
      >Profile</div>
      </div>
    </div>
  );
};
