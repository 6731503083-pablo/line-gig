// import liff from "@line/liff";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// useLocation, 

export const FeedsPage = () => {
  const navigate = useNavigate();
  const [showBotDialog, setShowBotDialog] = useState(false);
  // const location = useLocation();
  // const type = localStorage.getItem("userType") || (location.state as { type?: string })?.type;

  useEffect(() => {
    // Check if user has already followed the bot
    const hasFollowedBot = localStorage.getItem("hasFollowedBot");
    if (!hasFollowedBot) {
      setShowBotDialog(true);
    }
  }, []);

  const handleFollowBot = () => {
    // Open LINE bot link
    window.open("https://line.me/R/ti/p/@720ianqt", "_blank");
  };

  const handleConfirmFollowed = () => {
    // Save that user has followed the bot
    localStorage.setItem("hasFollowedBot", "true");
    setShowBotDialog(false);
  };
  
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
      {/* Bot Follow Dialog */}
      {showBotDialog && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2000,
          padding: "20px",
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "15px",
            padding: "30px",
            maxWidth: "400px",
            width: "100%",
            textAlign: "center",
            color: "#333",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
          }}>
            <h2 style={{
              color: "#06C755",
              marginBottom: "20px",
              fontSize: "24px",
              fontWeight: "bold",
            }}>
              Follow Our LINE Bot
            </h2>
            <p style={{
              marginBottom: "25px",
              fontSize: "16px",
              lineHeight: "1.5",
              color: "#666",
            }}>
              To use LINE GIG, please follow our official bot first. This will help you receive job notifications and updates.
            </p>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}>
              <button
                onClick={handleFollowBot}
                style={{
                  backgroundColor: "#06C755",
                  color: "white",
                  border: "none",
                  padding: "15px 25px",
                  borderRadius: "25px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "'Arial', sans-serif",
                  transition: "background-color 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#05a847";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#06C755";
                }}
              >
                Follow LINE Bot
              </button>
              <button
                onClick={handleConfirmFollowed}
                style={{
                  backgroundColor: "transparent",
                  color: "#06C755",
                  border: "2px solid #06C755",
                  padding: "12px 25px",
                  borderRadius: "25px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "'Arial', sans-serif",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#06C755";
                  e.currentTarget.style.color = "white";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#06C755";
                }}
              >
                I've Already Followed
              </button>
            </div>
          </div>
        </div>
      )}

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
