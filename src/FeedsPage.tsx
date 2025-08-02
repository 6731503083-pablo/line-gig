// import liff from "@line/liff";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BottomNav } from "./components/BottomNav";


export const FeedsPage = () => {
  const navigate = useNavigate();
  const [showBotDialog, setShowBotDialog] = useState(false);
  const location = useLocation();
  const type = localStorage.getItem("userType") || (location.state as { type?: string })?.type;

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
        {type == "employer" && (
          <div style={{
            backgroundColor: "#f8f9fa",
            padding: "25px",
            borderRadius: "15px",
            marginBottom: "20px",
            border: "2px solid #06C755",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(6, 199, 85, 0.1)",
          }}>
            <div style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#06C755",
              marginBottom: "10px",
            }}>
              Ready to Find Talent?
            </div>
            <div style={{
              fontSize: "16px",
              lineHeight: "1.5",
              color: "#666",
              marginBottom: "20px",
            }}>
              Post your job offers here and find the right candidates for your projects.
            </div>
            <button
              onClick={() => navigate("/create-job")}
              style={{
                backgroundColor: "#06C755",
                color: "white",
                border: "none",
                padding: "12px 30px",
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
              Create Job Posting
            </button>
          </div>
        )}
        
        {type == "freelancer" && (
          <div style={{
            backgroundColor: "#f8f9fa",
            padding: "25px",
            borderRadius: "15px",
            marginBottom: "20px",
            border: "2px solid #06C755",
            boxShadow: "0 4px 12px rgba(6, 199, 85, 0.1)",
          }}>
            <div style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#06C755",
              marginBottom: "15px",
              textAlign: "center",
            }}>
              Find Your Next Gig
            </div>
            <div style={{
              position: "relative",
              marginBottom: "15px",
            }}>
              <input
                type="text"
                placeholder="Search for jobs, skills, or companies..."
                style={{
                  width: "100%",
                  padding: "15px 20px",
                  paddingRight: "50px",
                  borderRadius: "25px",
                  border: "2px solid #e0e0e0",
                  fontSize: "16px",
                  fontFamily: "'Arial', sans-serif",
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#06C755";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e0e0e0";
                }}
              />
              <div style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#06C755",
                fontSize: "18px",
                fontWeight: "bold",
              }}>
                🔍
              </div>
            </div>
            
          </div>
        )}

        {/* Recent Activity or Job Listings */}
        <div style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "15px",
          border: "1px solid #e0e0e0",
        }}>
          <h3 style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "15px",
            textAlign: "center",
          }}>
            {type === "employer" ? "Recent Job Postings" : "Available Jobs"}
          </h3>
          <div style={{
            textAlign: "center",
            color: "#666",
            fontSize: "16px",
            fontStyle: "italic",
          }}>
            No {type === "employer" ? "postings" : "jobs"} available yet.
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav userType={type as "employer" | "freelancer" | null} />
    </div>
  );
};
