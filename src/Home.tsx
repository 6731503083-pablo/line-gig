import liff from "@line/liff";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserData {
  userType: "employer" | "freelancer";
  userData: any;
}

function Home() {
  const navigate = useNavigate();
  const [userStatus, setUserStatus] = useState<{
    isLoggedIn: boolean;
    isExistingUser: boolean;
    userData: UserData | null;
    loading: boolean;
  }>({
    isLoggedIn: false,
    isExistingUser: false,
    userData: null,
    loading: true,
  });

  const checkUserExists = async (userId: string) => {
    try {
      // Check if user exists as employer
      const employerResponse = await fetch(`https://line-gig-api.vercel.app/employers?userId=${userId}`);
      if (employerResponse.ok) {
        const employers = await employerResponse.json();
        if (employers.length > 0) {
          return { userType: "employer" as const, userData: employers[0] };
        }
      }

      // Check if user exists as freelancer
      const freelancerResponse = await fetch(`https://line-gig-api.vercel.app/freelancers?userId=${userId}`);
      if (freelancerResponse.ok) {
        const freelancers = await freelancerResponse.json();
        if (freelancers.length > 0) {
          return { userType: "freelancer" as const, userData: freelancers[0] };
        }
      }

      return null;
    } catch (error) {
      console.error("Error checking user existence:", error);
      return null;
    }
  };

  const createNewUser = async (type: "employer" | "freelancer", userId: string, profile: any) => {
    try {
      const endpoint = type === "employer" 
        ? "https://line-gig-api.vercel.app/api/employers"
        : "https://line-gig-api.vercel.app/api/freelancers";

      const userData = type === "employer" 
        ? {
            userId: userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl,
            bio: "",
            location: "",
            company: "",
            industry: "",
            budgetRange: "",
            projectTypes: "",
          }
        : {
            userId: userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl,
            bio: "",
            location: "",
            skills: [],
            experience: "",
            hourlyRate: "",
            availability: "",
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const newUser = await response.json();
        localStorage.setItem("userType", type);
        return newUser;
      }
    } catch (error) {
      console.error("Error creating new user:", error);
    }
    return null;
  };

  const handleButtonClick = async (type: "employer" | "freelancer") => {
    if (!liff.isLoggedIn()) {
      navigate("/login", { state: { type } });
      return;
    }

    try {
      const profile = await liff.getProfile();
      await createNewUser(type, profile.userId, profile);
      localStorage.setItem("userType", type);
      navigate("/feeds");
    } catch (error) {
      console.error("Error handling button click:", error);
      navigate("/login", { state: { type } });
    }
  };

  const handleGoInside = () => {
    if (userStatus.userData) {
      localStorage.setItem("userType", userStatus.userData.userType);
      navigate("/feeds");
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      try {
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          console.log("User Profile:", profile);
          
          const existingUser = await checkUserExists(profile.userId);
          
          setUserStatus({
            isLoggedIn: true,
            isExistingUser: !!existingUser,
            userData: existingUser,
            loading: false,
          });
        } else {
          // If not in LIFF client, still try to check login status
          if (!liff.isInClient()) {
            setUserStatus(prev => ({ ...prev, loading: false }));
          } else {
            setUserStatus({
              isLoggedIn: false,
              isExistingUser: false,
              userData: null,
              loading: false,
            });
          }
        }
      } catch (error) {
        console.error("Failed to get LINE profile:", error);
        setUserStatus({
          isLoggedIn: false,
          isExistingUser: false,
          userData: null,
          loading: false,
        });
      }
    };

    initializeUser();
  }, []);

  if (userStatus.loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: "18px",
          fontFamily: "'Arial', sans-serif",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white",
        fontSize: "24px",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#06C755",
          fontSize: "36px",
          fontWeight: "bold",
          width: "100%",
          textAlign: "center",
          padding: "20px 0",
          borderRadius: "5px",
          fontFamily: "'Arial', sans-serif",
        }}
      >
        LINE GIG
      </div>

      {userStatus.isExistingUser && userStatus.userData ? (
        // Existing user - Welcome back
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#06C755",
              marginBottom: "10px",
            }}
          >
            Welcome Back!
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "#666",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            Continue as {userStatus.userData.userType === "employer" ? "Employer" : "Freelancer"}
          </div>
          <div
            style={{
              backgroundColor: "#06C755",
              padding: "15px 30px",
              borderRadius: "25px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              fontFamily: "'Arial', sans-serif",
              fontSize: "18px",
              fontWeight: "bold",
            }}
            onClick={handleGoInside}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#05a847";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#06C755";
            }}
          >
            Go Inside
          </div>
        </div>
      ) : (
        // New user or not logged in - Show role selection
        <div
          style={{
            display: "flex",
            gap: "20px",
            textAlign: "center",
            fontSize: "18px",
          }}
        >
          <div
            style={{
              backgroundColor: "#06C755",
              padding: "15px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              fontFamily: "'Arial', sans-serif",
            }}
            onClick={() => handleButtonClick("employer")}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = "#06C755";
              e.currentTarget.style.border = "1px solid #06C755";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#06C755";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.border = "1px solid white";
            }}
          >
            Create Job Offers
          </div>
          <div
            style={{
              border: "1px solid #06C755",
              padding: "15px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              fontFamily: "'Arial', sans-serif",
              color: "#06C755",
            }}
            onClick={() => handleButtonClick("freelancer")}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#06C755";
              e.currentTarget.style.color = "white";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#06C755";
            }}
          >
            Find Job Offers
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
