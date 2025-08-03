import { useState, useEffect } from 'react';
import { BottomNav } from './components/BottomNav';
import liff from "@line/liff";

type AcceptedOffer = {
  id: string;
  title: string;
  description: string;
  budget: string;
  employerId: string;
  requirements: string;
  deadline: string;
  status: string;
  createdAt: string;
  acceptedAt: string;
  freelancerId: string;
};

export const HistoryPage = () => {
  const userType = localStorage.getItem("userType") as "employer" | "freelancer" | null;
  const [acceptedOffers, setAcceptedOffers] = useState<AcceptedOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOfferId, setExpandedOfferId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAcceptedOffers = async () => {
      if (userType === "freelancer") {
        try {
          if (liff.isLoggedIn()) {
            const profile = await liff.getProfile();
            const response = await fetch(`https://line-gig-api.vercel.app/api/accepted-offers/freelancer/${profile.userId}`);
            if (response.ok) {
              const data = await response.json();
              setAcceptedOffers(data);
            }
          }
        } catch (error) {
          console.error("Error fetching accepted offers:", error);
        }
      }
      setLoading(false);
    };

    fetchAcceptedOffers();
  }, [userType]);

  const handleToggle = (offerId: string) => {
    setExpandedOfferId(prevId => (prevId === offerId ? null : offerId));
  };
  
  return (
    <div style={{
      minHeight: "100vh",
      paddingBottom: "80px", // Space for bottom navigation
      backgroundColor: "#06C755",
      color: "white",
      fontFamily: "'Arial', sans-serif",
    }}>
      {/* Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        padding: "20px",
        paddingBottom: "30px"
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: "24px",
          fontWeight: "bold"
        }}>
          Work History
        </h1>
      </div>

      <div style={{
        padding: "20px",
        backgroundColor: "#fff",
        color: "#333",
        margin: "0 20px 20px 20px",
        borderRadius: "15px",
        minHeight: "calc(100vh - 200px)",
      }}>
        {userType === "freelancer" ? (
          <>
            <h2 style={{ textAlign: "center", color: "#06C755", marginBottom: "20px" }}>
              Accepted Projects
            </h2>
            
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                Loading your project history...
              </div>
            ) : acceptedOffers.length > 0 ? (
              <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                {acceptedOffers.map((offer) => {
                  const isExpanded = expandedOfferId === offer.id;
                  const shortDesc = offer.description.slice(0, 120);
                  
                  return (
                    <div
                      key={offer.id}
                      style={{
                        background: "#f8f9fa",
                        border: "1px solid #ddd",
                        borderRadius: "12px",
                        padding: "20px",
                        marginBottom: "15px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div>
                        <h3 style={{ 
                          marginBottom: "10px",
                          marginTop: 0, 
                          fontSize: "18px",
                          color: "#06C755"
                        }}>
                          {offer.title}
                        </h3>
                        <p style={{ 
                          margin: "5px 0",
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: "#28a745"
                        }}>
                          Budget: {offer.budget}
                        </p>
                        <p style={{ 
                          margin: "5px 0",
                          fontSize: "12px",
                          color: "#666"
                        }}>
                          Accepted on: {new Date(offer.acceptedAt).toLocaleDateString()}
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
                            <p style={{ fontSize: "14px", color: "#333", fontWeight: "bold" }}>
                              Requirements: {offer.requirements}
                            </p>
                          </div>
                        )}
                        
                        {isExpanded && offer.deadline && (
                          <div style={{ marginTop: "10px" }}>
                            <p style={{ fontSize: "14px", color: "#333", fontWeight: "bold" }}>
                              Deadline: {offer.deadline}
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
                            fontWeight: "600",
                            marginTop: "10px",
                          }}
                        >
                          {isExpanded ? "Show Less" : "Read More"}
                        </button>
                      </div>

                      {/* Status badge */}
                      <div style={{
                        marginTop: "15px",
                        padding: "8px 16px",
                        backgroundColor: "#28a745",
                        color: "white",
                        borderRadius: "20px",
                        textAlign: "center",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}>
                        ✅ Project Accepted
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ 
                textAlign: "center", 
                color: "#666", 
                padding: "40px 20px",
                fontSize: "16px"
              }}>
                <div style={{ fontSize: "48px", marginBottom: "20px" }}>📋</div>
                <p>No accepted projects yet.</p>
                <p style={{ fontSize: "14px" }}>Start browsing offers in the Feeds to build your work history!</p>
              </div>
            )}
          </>
        ) : (
          <>
            <h2 style={{ textAlign: "center", color: "#06C755" }}>Work History</h2>
            <p style={{ textAlign: "center", color: "#666" }}>
              Your completed projects and work history will appear here.
            </p>
          </>
        )}
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav userType={userType} />
    </div>
  );
};
