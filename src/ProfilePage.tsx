import liff from "@line/liff";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "./components/BottomNav";

interface Profile {
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
  userId: string;
}

interface UserProfile {
  profile: Profile | null;
  userType: "employer" | "freelancer" | null;
  bio: string;
  skills: string[];
  experience: string;
  location: string;
  hourlyRate: string;
  availability: string;
}

function ProfilePage() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    profile: null,
    userType: null,
    bio: "",
    skills: [],
    experience: "",
    location: "",
    hourlyRate: "",
    availability: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    bio: "",
    skills: "",
    experience: "",
    location: "",
    hourlyRate: "",
    availability: "",
  });

  useEffect(() => {
    const initProfile = async () => {
      try {
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          const userType = localStorage.getItem("userType") as "employer" | "freelancer" | null;
          
          // Load saved profile data from localStorage
          const savedProfile = localStorage.getItem("userProfileData");
          const profileData = savedProfile ? JSON.parse(savedProfile) : {};
          
          setUserProfile({
            profile,
            userType,
            bio: profileData.bio || "",
            skills: profileData.skills || [],
            experience: profileData.experience || "",
            location: profileData.location || "",
            hourlyRate: profileData.hourlyRate || "",
            availability: profileData.availability || "",
          });

          setEditData({
            bio: profileData.bio || "",
            skills: profileData.skills?.join(", ") || "",
            experience: profileData.experience || "",
            location: profileData.location || "",
            hourlyRate: profileData.hourlyRate || "",
            availability: profileData.availability || "",
          });
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Failed to get profile:", error);
        navigate("/login");
      }
    };

    initProfile();
  }, [navigate]);

  const handleSave = () => {
    const profileData = {
      bio: editData.bio,
      skills: editData.skills.split(",").map(skill => skill.trim()).filter(skill => skill),
      experience: editData.experience,
      location: editData.location,
      hourlyRate: editData.hourlyRate,
      availability: editData.availability,
    };

    localStorage.setItem("userProfileData", JSON.stringify(profileData));
    
    setUserProfile(prev => ({
      ...prev,
      ...profileData,
    }));
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      bio: userProfile.bio,
      skills: userProfile.skills.join(", "),
      experience: userProfile.experience,
      location: userProfile.location,
      hourlyRate: userProfile.hourlyRate,
      availability: userProfile.availability,
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    liff.logout();
    localStorage.removeItem("userType");
    localStorage.removeItem("userProfileData");
    navigate("/");
  };

  if (!userProfile.profile) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        color: "white",
        fontFamily: "'Arial', sans-serif"
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "'Arial', sans-serif",
        color: "white",
        boxSizing: "border-box",
        backgroundColor: "#06C755",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={() => navigate("/feeds")}
          style={{
            backgroundColor: "transparent",
            border: "1px solid #fff",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "5px",
            cursor: "pointer",
            fontFamily: "'Arial', sans-serif",
          }}
        >
          ← Back
        </button>
        
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          Profile
        </h1>
        
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#ff4444",
            border: "none",
            color: "white",
            padding: "8px 16px",
            borderRadius: "5px",
            cursor: "pointer",
            fontFamily: "'Arial', sans-serif",
          }}
        >
          Logout
        </button>
      </div>

      {/* Profile Card */}
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "15px",
          padding: "30px",
          marginBottom: "20px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Basic Info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "25px",
            gap: "20px",
          }}
        >
          <img
            src={userProfile.profile.pictureUrl || "/default-avatar.png"}
            alt="Profile"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              border: "3px solid #fff",
            }}
          />
          <div>
            <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "bold" }}>
              {userProfile.profile.displayName}
            </h2>
            <div
              style={{
                backgroundColor: "#fff",
                color: "#06C755",
                padding: "4px 12px",
                borderRadius: "15px",
                fontSize: "14px",
                marginTop: "8px",
                display: "inline-block",
                textTransform: "capitalize",
              }}
            >
              {userProfile.userType}
            </div>
          </div>
        </div>

        {/* Status Message */}
        {userProfile.profile.statusMessage && (
          <div
            style={{
              fontStyle: "italic",
              marginBottom: "20px",
              opacity: 0.8,
              fontSize: "16px",
            }}
          >
            "{userProfile.profile.statusMessage}"
          </div>
        )}

        {/* Edit Button */}
        <div style={{ textAlign: "right", marginBottom: "20px" }}>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                backgroundColor: "#fff",
                border: "none",
                color: "#06C755",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                fontFamily: "'Arial', sans-serif",
              }}
            >
              Edit Profile
            </button>
          ) : (
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={handleCancel}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #666",
                  color: "#666",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontFamily: "'Arial', sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  backgroundColor: "#06C755",
                  border: "none",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontFamily: "'Arial', sans-serif",
                }}
              >
                Save
              </button>
            </div>
          )}
        </div>

        {/* Profile Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Bio - Common for both types */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              Bio:
            </label>
            {isEditing ? (
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                  fontFamily: "'Arial', sans-serif",
                  resize: "vertical",
                  minHeight: "80px",
                  boxSizing: "border-box",
                }}
                placeholder="Tell us about yourself..."
              />
            ) : (
              <div style={{ fontSize: "16px", lineHeight: "1.5" }}>
                {userProfile.bio || "No bio added yet."}
              </div>
            )}
          </div>

          {/* Location - Common for both types */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              Location:
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editData.location}
                onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                  fontFamily: "'Arial', sans-serif",
                  boxSizing: "border-box",
                }}
                placeholder="Tokyo, Japan / Remote"
              />
            ) : (
              <div style={{ fontSize: "16px" }}>
                {userProfile.location || "No location specified."}
              </div>
            )}
          </div>

          {/* Freelancer-specific fields */}
          {userProfile.userType === "freelancer" && (
            <>
              {/* Skills */}
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                  Skills:
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.skills}
                    onChange={(e) => setEditData({ ...editData, skills: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      fontSize: "16px",
                      fontFamily: "'Arial', sans-serif",
                      boxSizing: "border-box",
                    }}
                    placeholder="React, JavaScript, Design, etc. (comma separated)"
                  />
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {userProfile.skills.length > 0 ? (
                      userProfile.skills.map((skill, index) => (
                        <span
                          key={index}
                          style={{
                            backgroundColor: "#fff",
                            color: "#06C755",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "14px",
                            border: "1px solid #06C755",
                          }}
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span style={{ opacity: 0.7 }}>No skills added yet.</span>
                    )}
                  </div>
                )}
              </div>

              {/* Experience */}
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                  Experience:
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.experience}
                    onChange={(e) => setEditData({ ...editData, experience: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      fontSize: "16px",
                      fontFamily: "'Arial', sans-serif",
                      boxSizing: "border-box",
                    }}
                    placeholder="5+ years, Beginner, Expert, etc."
                  />
                ) : (
                  <div style={{ fontSize: "16px" }}>
                    {userProfile.experience || "No experience info added."}
                  </div>
                )}
              </div>

              {/* Hourly Rate */}
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                  Hourly Rate:
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.hourlyRate}
                    onChange={(e) => setEditData({ ...editData, hourlyRate: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      fontSize: "16px",
                      fontFamily: "'Arial', sans-serif",
                      boxSizing: "border-box",
                    }}
                    placeholder="$50/hour, ¥5000/hour, etc."
                  />
                ) : (
                  <div style={{ fontSize: "16px" }}>
                    {userProfile.hourlyRate || "No rate specified."}
                  </div>
                )}
              </div>

              {/* Availability */}
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                  Availability:
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.availability}
                    onChange={(e) => setEditData({ ...editData, availability: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      fontSize: "16px",
                      fontFamily: "'Arial', sans-serif",
                      boxSizing: "border-box",
                    }}
                    placeholder="Full-time, Part-time, Weekends only, etc."
                  />
                ) : (
                  <div style={{ fontSize: "16px" }}>
                    {userProfile.availability || "No availability info added."}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Employer-specific fields */}
          {userProfile.userType === "employer" && (
            <>
              {/* Company/Organization */}
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                  Company/Organization:
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.experience}
                    onChange={(e) => setEditData({ ...editData, experience: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      fontSize: "16px",
                      fontFamily: "'Arial', sans-serif",
                      boxSizing: "border-box",
                    }}
                    placeholder="Your company or organization name"
                  />
                ) : (
                  <div style={{ fontSize: "16px" }}>
                    {userProfile.experience || "No company info added."}
                  </div>
                )}
              </div>

              {/* Industry */}
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                  Industry:
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.skills}
                    onChange={(e) => setEditData({ ...editData, skills: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      fontSize: "16px",
                      fontFamily: "'Arial', sans-serif",
                      boxSizing: "border-box",
                    }}
                    placeholder="Technology, Healthcare, Finance, etc."
                  />
                ) : (
                  <div style={{ fontSize: "16px" }}>
                    {editData.skills || "No industry specified."}
                  </div>
                )}
              </div>

              {/* Typical Budget Range */}
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                  Typical Budget Range:
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.hourlyRate}
                    onChange={(e) => setEditData({ ...editData, hourlyRate: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      fontSize: "16px",
                      fontFamily: "'Arial', sans-serif",
                      boxSizing: "border-box",
                    }}
                    placeholder="$1000-5000, ¥100,000-500,000, etc."
                  />
                ) : (
                  <div style={{ fontSize: "16px" }}>
                    {userProfile.hourlyRate || "No budget range specified."}
                  </div>
                )}
              </div>

              {/* Preferred Project Types */}
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                  Preferred Project Types:
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.availability}
                    onChange={(e) => setEditData({ ...editData, availability: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      fontSize: "16px",
                      fontFamily: "'Arial', sans-serif",
                      boxSizing: "border-box",
                    }}
                    placeholder="Web Development, Mobile Apps, Design, etc."
                  />
                ) : (
                  <div style={{ fontSize: "16px" }}>
                    {userProfile.availability || "No project types specified."}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* User ID (for debugging/reference) */}
      <div
        style={{
          fontSize: "12px",
          opacity: 0.5,
          textAlign: "center",
          marginTop: "20px",
          marginBottom: "80px", // Space for bottom navigation
        }}
      >
        User ID: {userProfile.profile.userId}
      </div>

      {/* Bottom Navigation */}
      <BottomNav userType={userProfile.userType} />
    </div>
  );
}

export default ProfilePage;
