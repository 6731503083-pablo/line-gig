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
      height: "100%",
      backgroundColor: "#06C755",
      display: "flex",
      justifyContent: "space-between",
      alignItems: 'center'
    }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        marginBottom: "30px" 
      }}>
        <h1 
        style={{ 
          margin: 0, 
          fontSize: "24px" , 
          fontStyle: "bold"
          }}
          >LINE GIG Feeds</h1>
      </div> 
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap",
        padding: "20px",
        backgroundColor: "#fff"
      }}>
        <div 
        onClick={() => navigate("/offers")}
        style={{
          backgroundColor: "#06C755",
          color: "white",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
          display: "inline-block",
          fontFamily: "'Arial', sans-serif",
        }}
      >
        Offers Page
      </div>
      <div
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
      >Profile</div>
      </div>
    </div>
  );
};
