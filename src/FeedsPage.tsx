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
  const [showFreelancerInfo, setShowFreelancerInfo] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"offers" | "myServices">("offers");
  const [myServices, setMyServices] = useState<Service[]>([]);
  const location = useLocation();
  const type = localStorage.getItem("userType") || (location.state as { type?: string })?.type;

  useEffect(() => {
    // Show bot dialog only if user hasn't followed yet
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
        
        // If user is a freelancer, also fetch their own services
        if (type === "freelancer" && liff.isLoggedIn()) {
          try {
            const profile = await liff.getProfile();
            const freelancerServices = servicesData.filter((service: Service) => service.freelancerId === profile.userId);
            setMyServices(freelancerServices);
          } catch (error) {
            console.error("Error filtering freelancer services:", error);
          }
        }
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

  const handleShowFreelancerInfo = async (freelancerId: string) => {
    try {
      // For now, we'll create a mock freelancer info since we don't have a freelancer API
      // In a real app, you'd fetch this from your backend
      const mockFreelancerInfo = {
        id: freelancerId,
        name: "Freelancer",
        rating: 4.8,
        completedJobs: 45,
        skills: ["Web Development", "Mobile Apps", "UI/UX Design"],
        experience: "3+ years",
        location: "Bangkok, Thailand",
        responseTime: "Within 2 hours",
        languages: ["Thai", "English"]
      };
      
      setSelectedFreelancer(mockFreelancerInfo);
      setShowFreelancerInfo(true);
    } catch (error) {
      console.error("Error fetching freelancer info:", error);
      alert("Failed to load freelancer information.");
    }
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

  // const handleDecline = async (offerId: string) => {
  //   try {
  //     // Simply remove from local state for now (you can add backend logic later)
  //     setOffers(prevOffers => prevOffers.filter(offer => offer.id !== offerId));
  //     alert(`❌ Offer declined and removed from your feed.`);
  //   } catch (error) {
  //     console.error("Error declining offer:", error);
  //     alert("Failed to decline offer. Please try again.");
  //   }
  // };

  // const handleContactFreelancer = (serviceId: string) => {
  //   alert(`📧 Contacting freelancer for service: ${serviceId}`);
  //   // You can add logic to contact freelancer
  // };

  const handleBookService = async (serviceId: string) => {
    try {
      if (liff.isLoggedIn()) {
        const profile = await liff.getProfile();
        
        // Find the service being booked
        const serviceToBook = services.find(service => service.id === serviceId);
        if (!serviceToBook) {
          alert("Service not found");
          return;
        }

        // Prepare broadcast message data
        const broadcastData = {
          userId: serviceToBook.freelancerId, // Send to the freelancer who posted the service
          engagerName: profile.displayName || "Anonymous User" // Name of the employer booking the service
        };

        // Send broadcast notification to freelancer
        const response = await fetch("https://line-gig-message-service.onrender.com/api/broadcast", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(broadcastData),
        });

        if (response.ok) {
          alert(`📅 Service booked successfully! The freelancer has been notified.`);
        } else {
          console.error("Failed to send notification:", await response.text());
          alert("Service booking initiated, but notification failed. Please contact the freelancer directly.");
        }
      } else {
        alert("Please log in to book services.");
      }
    } catch (error) {
      console.error("Error booking service:", error);
      alert("Failed to book service. Please try again.");
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      const response = await fetch(`https://line-gig-api.vercel.app/services/${serviceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the service from local state
        setMyServices(prevServices => prevServices.filter(service => service.id !== serviceId));
        setServices(prevServices => prevServices.filter(service => service.id !== serviceId));
        alert(`✅ Service deleted successfully!`);
      } else {
        alert("Failed to delete service. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service. Please try again.");
    }
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

      {/* Freelancer Info Dialog */}
      {showFreelancerInfo && selectedFreelancer && (
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
            maxWidth: "450px",
            width: "100%",
            color: "#333",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
            maxHeight: "80vh",
            overflowY: "auto",
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}>
              <h2 style={{
                color: "#06C755",
                margin: 0,
                fontSize: "22px",
                fontWeight: "bold",
              }}>
                Freelancer Profile
              </h2>
              <button
                onClick={() => setShowFreelancerInfo(false)}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  fontSize: "24px",
                  color: "#666",
                  cursor: "pointer",
                  padding: "0",
                  width: "30px",
                  height: "30px",
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{
              textAlign: "center",
              marginBottom: "25px",
            }}>
              <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#06C755",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 15px",
                fontSize: "36px",
                color: "white",
                fontWeight: "bold",
              }}>
                {selectedFreelancer.name.charAt(0)}
              </div>
              <h3 style={{
                margin: "0 0 10px 0",
                fontSize: "20px",
                color: "#333",
              }}>
                {selectedFreelancer.name}
              </h3>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                marginBottom: "10px",
              }}>
                <span style={{ color: "#ffa500", fontSize: "18px" }}>★</span>
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>{selectedFreelancer.rating}</span>
                <span style={{ color: "#666", fontSize: "14px" }}>({selectedFreelancer.completedJobs} jobs completed)</span>
              </div>
            </div>

            <div style={{
              display: "grid",
              gap: "15px",
            }}>
              <div>
                <h4 style={{
                  margin: "0 0 8px 0",
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#06C755",
                  textTransform: "uppercase",
                }}>
                  Skills
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {selectedFreelancer.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: "#f0f8f0",
                        color: "#06C755",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                        border: "1px solid #06C755",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}>
                <div>
                  <h4 style={{
                    margin: "0 0 5px 0",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#06C755",
                    textTransform: "uppercase",
                  }}>
                    Experience
                  </h4>
                  <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                    {selectedFreelancer.experience}
                  </p>
                </div>

                <div>
                  <h4 style={{
                    margin: "0 0 5px 0",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#06C755",
                    textTransform: "uppercase",
                  }}>
                    Location
                  </h4>
                  <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                    {selectedFreelancer.location}
                  </p>
                </div>

                <div>
                  <h4 style={{
                    margin: "0 0 5px 0",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#06C755",
                    textTransform: "uppercase",
                  }}>
                    Response Time
                  </h4>
                  <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                    {selectedFreelancer.responseTime}
                  </p>
                </div>

                <div>
                  <h4 style={{
                    margin: "0 0 5px 0",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#06C755",
                    textTransform: "uppercase",
                  }}>
                    Languages
                  </h4>
                  <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                    {selectedFreelancer.languages.join(", ")}
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              marginTop: "25px",
              display: "flex",
              gap: "10px",
              justifyContent: "center",
            }}>
              <button
                onClick={() => setShowFreelancerInfo(false)}
                style={{
                  backgroundColor: "#f8f9fa",
                  color: "#333",
                  border: "2px solid #e0e0e0",
                  padding: "12px 25px",
                  borderRadius: "25px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "'Arial', sans-serif",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#e9ecef";
                  e.currentTarget.style.borderColor = "#adb5bd";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                  e.currentTarget.style.borderColor = "#e0e0e0";
                }}
              >
                Close
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
                  placeholder="Search for offers"
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

        {/* Tabs for Freelancers */}
        {type === "freelancer" && (
          <div style={{
            display: "flex",
            borderBottom: "3px solid #f0f0f0",
            marginBottom: "20px",
          }}>
            <button
              onClick={() => setActiveTab("offers")}
              style={{
                flex: 1,
                padding: "12px 20px",
                backgroundColor: activeTab === "offers" ? "#06C755" : "transparent",
                color: activeTab === "offers" ? "white" : "#666",
                border: "none",
                borderRadius: "8px 8px 0 0",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontFamily: "'Arial', sans-serif",
              }}
              onMouseOver={(e) => {
                if (activeTab !== "offers") {
                  e.currentTarget.style.backgroundColor = "#f0f8f0";
                  e.currentTarget.style.color = "#06C755";
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== "offers") {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#666";
                }
              }}
            >
              Available Offers ({offers.length})
            </button>
            <button
              onClick={() => setActiveTab("myServices")}
              style={{
                flex: 1,
                padding: "12px 20px",
                backgroundColor: activeTab === "myServices" ? "#06C755" : "transparent",
                color: activeTab === "myServices" ? "white" : "#666",
                border: "none",
                borderRadius: "8px 8px 0 0",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontFamily: "'Arial', sans-serif",
              }}
              onMouseOver={(e) => {
                if (activeTab !== "myServices") {
                  e.currentTarget.style.backgroundColor = "#f0f8f0";
                  e.currentTarget.style.color = "#06C755";
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== "myServices") {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#666";
                }
              }}
            >
              My Services ({myServices.length})
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
              {type === "employer" 
                ? "Available Services" 
                : type === "freelancer" && activeTab === "myServices"
                  ? "My Posted Services"
                  : "Available Offers"}
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
                          // color: "#06C755",
                          fontWeight: "bold"
                        }}>
                          Budget: ฿{service.budget}
                        </span>
                      </div>
                      <p style={{ 
                        margin: "5px 0",
                        fontSize: "14px",
                        color: "#666"
                      }}>
                        Category: {service.category}
                      </p>
                    </div>

                    <div style={{
                      fontSize: "15px",
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
                        onClick={() => handleShowFreelancerInfo(service.freelancerId)}
                        style={{
                          padding: "10px 20px",
                          border: "2px solid #06C755",
                          borderRadius: "8px",
                          fontSize: "14px",
                          color: "#06C755",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                          fontWeight: "600",
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
                        View Profile
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
          {!isLoading && type === "freelancer" && activeTab === "offers" && offers.length > 0 ? (
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
                          // color: "#191818ff",
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
                      {/* <button
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
                      </button> */}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : !isLoading && type === "freelancer" && activeTab === "offers" && offers.length === 0 ? (
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

          {/* Show My Services for Freelancers */}
          {!isLoading && type === "freelancer" && activeTab === "myServices" && myServices.length > 0 ? (
            <div style={{
              maxHeight: "60vh",
              overflowY: "auto",
              marginBottom: "20px",
            }}>
              {myServices.map((service) => {
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
                          color: "#0c0c0cff",
                          fontWeight: "bold"
                        }}>
                          Budget: ฿{service.budget}
                        </span>
                      </div>
                      <p style={{ 
                        margin: "5px 0",
                        fontSize: "14px",
                        color: "#666"
                      }}>
                        Category: {service.category} • Status: {service.status}
                      </p>
                    </div>

                    <div style={{
                      fontSize: "15px",
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

                      {isExpanded && (
                        <div style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
                          <p><strong>Duration:</strong> {service.duration}</p>
                          <p><strong>Location:</strong> {service.location}</p>
                          <p><strong>Urgency:</strong> {service.urgency}</p>
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
                          fontWeight: "600",
                        }}
                      >
                        {isExpanded ? "Show Less" : "Read More"}
                      </button>
                    </div>

                    {/* Action buttons for freelancer's own services */}
                    <div style={{
                      marginTop: "15px",
                      display: "flex",
                      gap: "15px",
                      justifyContent: "center",
                    }}>
                      <button
                        onClick={() => alert(`✏️ Edit service: ${service.title}`)}
                        style={{
                          padding: "10px 20px",
                          border: "2px solid #06C755",
                          borderRadius: "8px",
                          fontSize: "14px",
                          color: "#06C755",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                          fontWeight: "600",
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
                        Edit Service
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${service.title}"?`)) {
                            handleDeleteService(service.id);
                          }
                        }}
                        style={{
                          padding: "10px 20px",
                          border: "2px solid #dc3545",
                          borderRadius: "8px",
                          fontSize: "14px",
                          color: "#dc3545",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                          fontWeight: "600",
                          transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = "#dc3545";
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "#dc3545";
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : !isLoading && type === "freelancer" && activeTab === "myServices" && myServices.length === 0 ? (
            <div style={{
              textAlign: "center",
              color: "#666",
              fontSize: "16px",
              fontStyle: "italic",
              padding: "40px 20px",
            }}>
              <div style={{
                fontSize: "48px",
                marginBottom: "20px",
              }}>
                📝
              </div>
              <div style={{
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "10px",
                color: "#333",
              }}>
                No services posted yet
              </div>
              <div style={{
                marginBottom: "25px",
                lineHeight: "1.5",
              }}>
                Start by creating your first service to showcase your skills and attract potential clients.
              </div>
              <button
                onClick={() => navigate("/create-service")}
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
                Create Your First Service
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav userType={type as "employer" | "freelancer" | null} />
    </div>
  );
};
