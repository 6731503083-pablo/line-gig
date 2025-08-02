import { useLocation, useNavigate } from "react-router-dom";

interface BottomNavProps {
  userType: "employer" | "freelancer" | null;
}

export const BottomNav = ({ userType }: BottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const getTabStyle = (isActive: boolean) => ({
    backgroundColor: isActive ? "#06C755" : "transparent",
    color: isActive ? "white" : "#06C755",
    border: "2px solid #06C755",
    padding: "12px 20px",
    borderRadius: "25px",
    cursor: "pointer",
    fontFamily: "'Arial', sans-serif",
    fontWeight: "600",
    flex: 1,
    textAlign: "center" as const,
    maxWidth: userType === "freelancer" ? "120px" : "150px",
    fontSize: "14px",
    transition: "all 0.3s ease",
  });

  // Determine active states
  const isFeedsActive = currentPath === "/feeds";
  const isOffersActive = currentPath === "/offers";
  const isHistoryActive = currentPath === "/history";
  const isProfileActive = currentPath === "/profile";

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
      padding: "15px 20px",
      backgroundColor: "#fff",
      borderTop: "1px solid #eee",
      boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
      zIndex: 1000,
    }}>
      {/* Feeds Tab */}
      <div 
        onClick={() => navigate("/feeds")}
        style={getTabStyle(isFeedsActive)}
      >
        Feeds
      </div>

      {/* Offers/Services Tab */}
      <div 
        onClick={() => navigate("/offers")}
        style={getTabStyle(isOffersActive)}
      >
        {userType === "employer" ? "Offers" : "Services"}
      </div>
      
      {/* History tab - only for freelancers */}
      {userType === "freelancer" && (
        <div
          onClick={() => navigate("/history")}
          style={getTabStyle(isHistoryActive)}
        >
          History
        </div>
      )}

      {/* Profile Tab */}
      <div
        onClick={() => navigate("/profile")}
        style={getTabStyle(isProfileActive)}
      >
        Profile
      </div>
    </div>
  );
};
