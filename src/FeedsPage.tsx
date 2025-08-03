// import liff from "@line/liff";
import liff from "@line/liff";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BottomNav } from "./components/BottomNav";

type Offer = {
  id: string;
  title: string;
  description: string;
  budget: string;
  employerId: string;
  requirements: string;
  deadline: string;
  status: string;
  createdAt: string;
};

type Service = {
  id: string;
  title: string;
  description: string;
  budget: string;
  freelancerId: string;
  skills: string[];
  category: string;
  duration: string;
  location: string;
  urgency: string;
  status: string;
  createdAt: string;
};


export const FeedsPage = () => {
  const navigate = useNavigate();
  const [showBotDialog, setShowBotDialog] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [expandedOfferId, setExpandedOfferId] = useState<string | null>(null);
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const location = useLocation();
  const type = localStorage.getItem("userType") || (location.state as { type?: string })?.type;

  useEffect(() => {
    // Check if user has already followed the bot
    const hasFollowedBot = localStorage.getItem("hasFollowedBot");
    if (!hasFollowedBot) {
      setShowBotDialog(true);
    }

    fetchData();
  }, [type]);

  const fetchData = async () => {
    try {
      // Fetch offers from API
      const offersResponse = await fetch('https://line-gig-api.vercel.app/offers');
      if (offersResponse.ok) {
        let offersData = await offersResponse.json();
        
        // If user is a freelancer, filter out already accepted offers
        if (type === "freelancer" && liff.isLoggedIn()) {
          try {
            const profile = await liff.getProfile();
            const acceptedResponse = await fetch(`https://line-gig-api.vercel.app/api/accepted-offers/freelancer/${profile.userId}`);
            if (acceptedResponse.ok) {
              const acceptedOffers = await acceptedResponse.json();
              const acceptedOfferIds = acceptedOffers.map((offer: any) => offer.id);
              offersData = offersData.filter((offer: any) => !acceptedOfferIds.includes(offer.id));
            }
          } catch (error) {
            console.error("Error filtering accepted offers:", error);
          }
        }
        
        setOffers(offersData);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    }

    try {
      // Fetch services from API
      const servicesResponse = await fetch('https://line-gig-api.vercel.app/services');
      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        setServices(servicesData);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleServiceToggle = (serviceId: string) => {
    setExpandedServiceId(prevId => (prevId === serviceId ? null : serviceId));
  };

  const handleAccept = async (offerId: string) => {
    try {
      if (liff.isLoggedIn()) {
        const profile = await liff.getProfile();
        
        // Find the offer being accepted
        const offerToAccept = offers.find(offer => offer.id === offerId);
        if (!offerToAccept) {
          alert("Offer not found");
          return;
        }

        // Create accepted offer record
        const acceptedOfferData = {
          ...offerToAccept,
          freelancerId: profile.userId,
          acceptedAt: new Date().toISOString(),
          status: "accepted"
        };

        // Send to backend
        const response = await fetch("https://line-gig-api.vercel.app/api/accepted-offers", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(acceptedOfferData),
        });

        if (response.ok) {
          // Remove the offer from the current offers list
          setOffers(prevOffers => prevOffers.filter(offer => offer.id !== offerId));
          
          // Update the original offer status (optional)
          await fetch(`https://line-gig-api.vercel.app/offers/${offerId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: "accepted" }),
          });

          alert(`✅ Offer accepted successfully! Check your History page to see your accepted projects.`);
        } else {
          const errorData = await response.json();
          console.error("Failed to accept offer:", errorData);
          
          if (response.status === 409) {
            alert("This offer has already been accepted by you.");
          } else {
            alert("Failed to accept offer. Please try again.");
          }
        }
      }
    } catch (error) {
      console.error("Error accepting offer:", error);
      alert("Failed to accept offer. Please try again.");
    }
  };

  const handleDecline = async (offerId: string) => {
    try {
      // Simply remove from local state for now (you can add backend logic later)
      setOffers(prevOffers => prevOffers.filter(offer => offer.id !== offerId));
      alert(`❌ Offer declined and removed from your feed.`);
    } catch (error) {
      console.error("Error declining offer:", error);
      alert("Failed to decline offer. Please try again.");
    }
  };

  const handleContactFreelancer = (serviceId: string) => {
    alert(`📧 Contacting freelancer for service: ${serviceId}`);
    // You can add logic to contact freelancer
  };

  const handleBookService = (serviceId: string) => {
    alert(`📅 Booking service: ${serviceId}`);
    // You can add logic to book service
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
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
            // borderRadius: "15px",
            marginBottom: "20px",
            // border: "2px solid #06C755",
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
            {/* <div style={{
              fontSize: "16px",
              lineHeight: "1.5",
              color: "#666",
              marginBottom: "20px",
            }}>
              Post your offers here and find the right candidates for your projects.
            </div> */}
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
              display: "flex",
              gap: "10px",
              marginBottom: "15px",
            }}>
              <div style={{
                position: "relative",
                flex: 1,
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
              
              <button
                onClick={() => navigate("/create-service")}
                style={{
                  backgroundColor: "#06C755",
                  border: "none",
                  borderRadius: "50%",
                  width: "55px",
                  height: "55px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "24px",
                  color: "white",
                  boxShadow: "0 4px 12px rgba(6, 199, 85, 0.3)",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#05a847";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#06C755";
                  e.currentTarget.style.transform = "scale(1)";
                }}
                title="Create Service"
              >
                +
              </button>
            </div>   
        )}

        {/* Available Offers or Services */}
        <div style={{
          // backgroundColor: "#f8f9fa",
          // padding: "20px",
          // borderRadius: "15px",
          // border: "1px solid #e0e0e0",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}>
            <h3 style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#333",
              margin: 0,
              // textAlign: "center",
            }}>
              {type === "employer" ? "Available Services" : "Available Offers"}
            </h3>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              style={{
                backgroundColor: isRefreshing ? "#ccc" : "#06C755",
                border: "none",
                borderRadius: "20px",
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: isRefreshing ? "not-allowed" : "pointer",
                fontSize: "14px",
                color: "white",
                fontWeight: "600",
                boxShadow: "0 2px 8px rgba(6, 199, 85, 0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                if (!isRefreshing) {
                  e.currentTarget.style.backgroundColor = "#05a847";
                  e.currentTarget.style.transform = "scale(1.05)";
                }
              }}
              onMouseOut={(e) => {
                if (!isRefreshing) {
                  e.currentTarget.style.backgroundColor = "#06C755";
                  e.currentTarget.style.transform = "scale(1)";
                }
              }}
              title="Refresh data"
            >
              {isRefreshing ? "🔄 Refreshing..." : "🔄 Refresh"}
            </button>
          </div>
          
          {/* Loading indicator for initial load */}
          {isLoading && (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "60px 20px",
              textAlign: "center",
            }}>
              <div style={{
                width: "50px",
                height: "50px",
                border: "4px solid #e0e0e0",
                borderTop: "4px solid #06C755",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginBottom: "20px",
              }}></div>
              <div style={{
                fontSize: "16px",
                color: "#666",
                fontWeight: "500",
              }}>
                Loading {type === "employer" ? "services" : "offers"}...
              </div>
              <style dangerouslySetInnerHTML={{
                __html: `
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `
              }} />
            </div>
          )}
          
          {/* Show Services for Employers */}
          {!isLoading && type === "employer" && services.length > 0 ? (
            <div style={{
              maxHeight: "60vh",
              overflowY: "auto",
              marginBottom: "20px",
            }}>
              {services.map((service) => {
                const isExpanded = expandedServiceId === service.id;
                const shortDesc = service.description.slice(0, 80);

                return (
                  <div
                    key={service.id}
                    style={{
                      background: "#fff",
                      border: "3px solid #ddd",
                      borderRadius: "12px",
                      padding: "8px",
                      marginBottom: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "10px"
                      }}>
                        <h2 style={{ 
                          margin: 0, 
                          fontSize: "18px",
                          color: "#06C755",
                          fontWeight: "bold"
                        }}>
                          {service.title}
                        </h2>
                        <span style={{
                          fontSize: "15px",
                          color: "#06C755",
                          fontWeight: "bold"
                        }}>
                          ฿{service.budget}
                        </span>
                      </div>
                      <p style={{ 
                        margin: "5px 0",
                        fontSize: "12px",
                        color: "#666"
                      }}>
                        Category: {service.category}
                      </p>
                    </div>

                    <div style={{
                      fontSize: "15px",
                      lineHeight: 1.5,
                      color: "#444",
                      margin: "15px 0",
                    }}>
                      <p>{isExpanded ? service.description : shortDesc + "..."}</p>
                      
                      {isExpanded && service.skills && service.skills.length > 0 && (
                        <div style={{ marginTop: "15px" }}>
                          <h4 style={{ 
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#333",
                            marginBottom: "5px"
                          }}>
                            Skills:
                          </h4>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {service.skills.map((skill, index) => (
                              <span
                                key={index}
                                style={{
                                  backgroundColor: "#06C755",
                                  color: "white",
                                  padding: "4px 8px",
                                  borderRadius: "12px",
                                  fontSize: "12px",
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <button
                        onClick={() => handleServiceToggle(service.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#06C755",
                          cursor: "pointer",
                          fontSize: "14px",
                          paddingLeft: "5px",
                          marginTop: "10px",
                          fontWeight: "600",
                        }}
                      >
                        {isExpanded ? "Show Less" : "Read More"}
                      </button>
                    </div>

                    {/* Action buttons for employers viewing services */}
                    <div style={{
                      marginTop: "15px",
                      display: "flex",
                      gap: "15px",
                      justifyContent: "center",
                    }}>
                      <button
                        onClick={() => handleContactFreelancer(service.id)}
                        style={{
                          padding: "10px 20px",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "14px",
                          color: "white",
                          backgroundColor: "#007bff",
                          cursor: "pointer",
                          fontWeight: "600",
                          transition: "background-color 0.3s ease",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = "#0056b3";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = "#007bff";
                        }}
                      >
                        Contact
                      </button>
                      <button
                        onClick={() => handleBookService(service.id)}
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
                        Book Service
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : !isLoading && type === "employer" && services.length === 0 ? (
            <div style={{
              textAlign: "center",
              color: "#666",
              fontSize: "16px",
              fontStyle: "italic",
              padding: "40px 20px",
            }}>
              No services available yet.
            </div>
          ) : null}

          {/* Show Offers for Freelancers */}
          {!isLoading && type === "freelancer" && offers.length > 0 ? (
            <div style={{
              maxHeight: "60vh",
              overflowY: "auto",
              marginBottom: "20px",
            }}>
              {offers.map((offer) => {
                const isExpanded = expandedOfferId === offer.id;
                const shortDesc = offer.description.slice(0, 80);

                return (
                  <div
                    key={offer.id}
                    style={{
                      background: "#fff",
                      border: "3px solid #ddd",
                      borderRadius: "12px",
                      padding: "8px",
                      marginBottom: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "10px"
                      }}>
                        <h2 style={{ 
                          margin: 0,
                          fontSize: "18px",
                          color: "#06C755",
                          fontWeight: "bold"
                        }}>
                          {offer.title}
                        </h2>
                        <span style={{
                          fontSize: "15px",
                          color: "#0c0c0cff",
                          fontWeight: "bold"//
                        }}>
                          Budget: {offer.budget}
                        </span>
                      </div>
                      <p style={{ 
                        margin: "5px 0",
                        fontSize: "14px",
                        color: "#666"
                      }}>
                        Status: {offer.status}
                      </p>
                    </div>

                    <div style={{
                      fontSize: "15px",
                      color: "#444",
                      margin: "15px 0",
                    }}>
                      <p>{isExpanded ? offer.description : shortDesc + "..."}</p>
                      
                      {isExpanded && offer.requirements && (
                        <div style={{ marginTop: "15px"}}>
                          {/* <h4 style={{ 
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#333",
                            margin: 
                          }}>
                            Requirements:
                          </h4> */}
                          <p style={{ fontSize: "14px", color: "#333", fontWeight: "bold" }}>
                            Requirements: {offer.requirements}
                          </p>
                        </div>
                      )}
                      
                      {isExpanded && offer.deadline && (
                        <div style={{ marginTop: "10px" }}>
                          {/* <h4 style={{ 
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#333",
                            marginBottom: "5px"
                          }}>
                            Deadline:
                          </h4> */}
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
                          paddingLeft: "5px",
                          fontWeight: "600",
                        }}
                      >
                        {isExpanded ? "Show Less" : "Read More"}
                      </button>
                    </div>

                    {/* Action buttons - only show for freelancers viewing offers */}
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
                  </div>
                );
              })}
            </div>
          ) : !isLoading && type === "freelancer" && offers.length === 0 ? (
            <div style={{
              textAlign: "center",
              color: "#666",
              fontSize: "16px",
              fontStyle: "italic",
              padding: "40px 20px",
            }}>
              No offers available yet.
            </div>
          ) : null}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav userType={type as "employer" | "freelancer" | null} />
    </div>
  );
};
