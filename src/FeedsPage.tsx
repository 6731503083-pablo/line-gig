// import liff from "@line/liff";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BottomNav } from "./components/BottomNav";

type Offer = {
  id: string;
  title: string;
  description: string;
  budget: string;
  employerId: number;
  requirements: string;
  deadline: string;
  status: string;
  createdAt: string;
};


export const FeedsPage = () => {
  const navigate = useNavigate();
  const [showBotDialog, setShowBotDialog] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [expandedOfferId, setExpandedOfferId] = useState<string | null>(null);
  const location = useLocation();
  const type = localStorage.getItem("userType") || (location.state as { type?: string })?.type;

  useEffect(() => {
    // Check if user has already followed the bot
    const hasFollowedBot = localStorage.getItem("hasFollowedBot");
    if (!hasFollowedBot) {
      setShowBotDialog(true);
    }

    // Fetch offers from API
    fetch('https://line-gig-api.vercel.app/offers')
      .then(res => res.json())
      .then(data => {
        setOffers(data);
      })
      .catch(error => console.error('Error fetching offers:', error));
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

  const handleToggle = (offerId: string) => {
    setExpandedOfferId(prevId => (prevId === offerId ? null : offerId));
  };

  const handleAccept = (offerId: string) => {
    alert(`✅ Accepted offer with ID: ${offerId}`);
    // You can add logic to send accept to backend
  };

  const handleDecline = (offerId: string) => {
    alert(`❌ Declined offer with ID: ${offerId}`);
    // You can add logic to send decline to backend
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
              Post your offers here and find the right candidates for your projects.
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
              Create Offer
            </button>
          </div>
        )}
        
        {type == "freelancer" && (     
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

        )}

        {/* Available Offers */}
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
            {type === "employer" ? "Your Offers" : "Available Offers"}
          </h3>
          
          {offers.length > 0 ? (
            <div style={{
              maxHeight: "60vh",
              overflowY: "auto",
              marginBottom: "20px",
            }}>
              {offers.map((offer) => {
                const isExpanded = expandedOfferId === offer.id;
                const shortDesc = offer.description.slice(0, 120);

                return (
                  <div
                    key={offer.id}
                    style={{
                      background: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "12px",
                      padding: "20px",
                      marginBottom: "15px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div>
                      <h2 style={{ 
                        marginBottom: "10px", 
                        fontSize: "18px",
                        color: "#06C755"
                      }}>
                        {offer.title}
                      </h2>
                      <p style={{ 
                        margin: "5px 0",
                        fontSize: "14px",
                        fontWeight: "bold"
                      }}>
                        Budget: {offer.budget}
                      </p>
                      <p style={{ 
                        margin: "5px 0",
                        fontSize: "12px",
                        color: "#666"
                      }}>
                        Status: {offer.status}
                      </p>
                    </div>

                    <div style={{
                      fontSize: "15px",
                      lineHeight: 1.5,
                      color: "#444",
                      margin: "15px 0",
                    }}>
                      <p>{isExpanded ? offer.description : shortDesc + "..."}</p>
                      
                      {isExpanded && offer.requirements && (
                        <div style={{ marginTop: "15px" }}>
                          <h4 style={{ 
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#333",
                            marginBottom: "5px"
                          }}>
                            Requirements:
                          </h4>
                          <p style={{ fontSize: "14px", color: "#666" }}>
                            {offer.requirements}
                          </p>
                        </div>
                      )}
                      
                      {isExpanded && offer.deadline && (
                        <div style={{ marginTop: "10px" }}>
                          <h4 style={{ 
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#333",
                            marginBottom: "5px"
                          }}>
                            Deadline:
                          </h4>
                          <p style={{ fontSize: "14px", color: "#666" }}>
                            {offer.deadline}
                          </p>
                        </div>
                      )}
                      
                      <button
                        onClick={() => handleToggle(offer.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#06C755",
                          cursor: "pointer",
                          fontSize: "14px",
                          padding: "5px 0",
                          marginTop: "10px",
                          fontWeight: "600",
                        }}
                      >
                        {isExpanded ? "Show Less" : "Read More"}
                      </button>
                    </div>

                    {/* Action buttons - only show for freelancers */}
                    {type === "freelancer" && (
                      <div style={{
                        marginTop: "15px",
                        display: "flex",
                        gap: "15px",
                        justifyContent: "center",
                      }}>
                        <button
                          onClick={() => handleAccept(offer.id)}
                          style={{
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "14px",
                            color: "white",
                            backgroundColor: "#06C755",
                            cursor: "pointer",
                            fontWeight: "600",
                            transition: "background-color 0.3s ease",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "#05a847";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = "#06C755";
                          }}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDecline(offer.id)}
                          style={{
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "14px",
                            color: "white",
                            backgroundColor: "#dc3545",
                            cursor: "pointer",
                            fontWeight: "600",
                            transition: "background-color 0.3s ease",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "#c82333";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = "#dc3545";
                          }}
                        >
                          Decline
                        </button>
                      </div>
                    )}
                    
                    {/* For employers, show a different message */}
                    {type === "employer" && (
                      <div style={{
                        marginTop: "15px",
                        padding: "10px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                        textAlign: "center",
                        fontSize: "14px",
                        color: "#666",
                        fontStyle: "italic",
                      }}>
                        This is one of your posted offers
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{
              textAlign: "center",
              color: "#666",
              fontSize: "16px",
              fontStyle: "italic",
              padding: "40px 20px",
            }}>
              No {type === "employer" ? "offers" : "offers"} available yet.
              {type === "employer" && (
                <div style={{ marginTop: "15px" }}>
                  <button
                    onClick={() => navigate("/create-job")}
                    style={{
                      backgroundColor: "#06C755",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "20px",
                      fontSize: "14px",
                      cursor: "pointer",
                      fontFamily: "'Arial', sans-serif",
                    }}
                  >
                    Create Your First Offer
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav userType={type as "employer" | "freelancer" | null} />
    </div>
  );
};
