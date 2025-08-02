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
  dbId: number | null;
  bio: string;
  skills: string[];
  experience: string;
  location: string;
  hourlyRate: string;
  availability: string;
  company?: string;
  industry?: string;
  budgetRange?: string;
  projectTypes?: string;
}

function ProfilePage() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    profile: null,
    userType: null,
    dbId: null,
    bio: "",
    skills: [],
    experience: "",
    location: "",
    hourlyRate: "",
    availability: "",
    company: "",
    industry: "",
    budgetRange: "",
    projectTypes: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    bio: "",
    skills: "",
    experience: "",
    location: "",
    hourlyRate: "",
    availability: "",
    company: "",
    industry: "",
    budgetRange: "",
    projectTypes: "",
  });

  // Fetch user data from API
  const fetchUserData = async (userId: string, userType: "employer" | "freelancer") => {
    try {
      const endpoint = userType === "employer" 
        ? "https://line-gig-api.vercel.app/employers"
        : "https://line-gig-api.vercel.app/freelancers";
      
      const response = await fetch(endpoint);
      if (response.ok) {
        const users = await response.json();
        const userData = users.find((user: any) => user.lineId === userId);
        return userData;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  // Update user data via API
  const updateUserData = async (userData: any) => {
    try {
      const endpoint = userProfile.userType === "employer" 
        ? `https://line-gig-api.vercel.app/api/employers/${userProfile.dbId}`
        : `https://line-gig-api.vercel.app/api/freelancers/${userProfile.dbId}`;
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        return updatedUser;
      } else {
        console.error("Failed to update user data");
        return null;
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      return null;
    }
  };

  useEffect(() => {
    const initProfile = async () => {
      try {
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          const userType = localStorage.getItem("userType") as "employer" | "freelancer" | null;
          
          if (userType) {
            // Fetch user data from API
            const userData = await fetchUserData(profile.userId, userType);
            
            if (userData) {
              // User exists in database
              setUserProfile({
                profile,
                userType,
                dbId: userData.id,
                bio: userData.bio || "",
                skills: userData.skills || [],
                experience: userData.experience || "",
                location: userData.location || "",
                hourlyRate: userData.hourlyRate || "",
                availability: userData.availability || "",
                company: userData.company || "",
                industry: userData.industry || "",
                budgetRange: userData.budgetRange || "",
                projectTypes: userData.projectTypes || "",
              });

              setEditData({
                bio: userData.bio || "",
                skills: Array.isArray(userData.skills) ? userData.skills.join(", ") : (userData.skills || ""),
                experience: userData.experience || "",
                location: userData.location || "",
                hourlyRate: userData.hourlyRate || "",
                availability: userData.availability || "",
                company: userData.company || "",
                industry: userData.industry || "",
                budgetRange: userData.budgetRange || "",
                projectTypes: userData.projectTypes || "",
              });
            } else {
              // User not found in database, show empty profile
              setUserProfile({
                profile,
                userType,
                dbId: null,
                bio: "",
                skills: [],
                experience: "",
                location: "",
                hourlyRate: "",
                availability: "",
                company: "",
                industry: "",
                budgetRange: "",
                projectTypes: "",
              });

              setEditData({
                bio: "",
                skills: "",
                experience: "",
                location: "",
                hourlyRate: "",
                availability: "",
                company: "",
                industry: "",
                budgetRange: "",
                projectTypes: "",
              });
            }
          }
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

  const handleSave = async () => {
    if (!userProfile.dbId) {
      console.error("No database ID found for user");
      return;
    }

    setIsSaving(true);

    const profileData = userProfile.userType === "employer" 
      ? {
          bio: editData.bio,
          location: editData.location,
          company: editData.company,
          industry: editData.industry,
          budgetRange: editData.budgetRange,
          projectTypes: editData.projectTypes,
        }
      : {
          bio: editData.bio,
          location: editData.location,
          skills: editData.skills.split(",").map(skill => skill.trim()).filter(skill => skill),
          experience: editData.experience,
          hourlyRate: editData.hourlyRate,
          availability: editData.availability,
        };

    const updatedUser = await updateUserData(profileData);
    
    if (updatedUser) {
      setUserProfile(prev => ({
        ...prev,
        bio: updatedUser.bio,
        location: updatedUser.location,
        skills: updatedUser.skills || [],
        experience: updatedUser.experience || "",
        hourlyRate: updatedUser.hourlyRate || "",
        availability: updatedUser.availability || "",
        company: updatedUser.company || "",
        industry: updatedUser.industry || "",
        budgetRange: updatedUser.budgetRange || "",
        projectTypes: updatedUser.projectTypes || "",
      }));
      
      setIsEditing(false);
      console.log("Profile updated successfully");
    } else {
      console.error("Failed to update profile");
    }
    
    setIsSaving(false);
  };

  const handleCancel = () => {
    setEditData({
      bio: userProfile.bio,
      skills: Array.isArray(userProfile.skills) ? userProfile.skills.join(", ") : "",
      experience: userProfile.experience,
      location: userProfile.location,
      hourlyRate: userProfile.hourlyRate,
      availability: userProfile.availability,
      company: userProfile.company || "",
      industry: userProfile.industry || "",
      budgetRange: userProfile.budgetRange || "",
      projectTypes: userProfile.projectTypes || "",
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    liff.logout();
    localStorage.removeItem("userType");
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
                disabled={isSaving}
                style={{
                  backgroundColor: isSaving ? "#ccc" : "#06C755",
                  border: "none",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  fontFamily: "'Arial', sans-serif",
                }}
              >
                {isSaving ? "Saving..." : "Save"}
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
                    value={editData.company}
                    onChange={(e) => setEditData({ ...editData, company: e.target.value })}
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
                    {userProfile.company || "No company info added."}
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
                    value={editData.industry}
                    onChange={(e) => setEditData({ ...editData, industry: e.target.value })}
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
                    {userProfile.industry || "No industry specified."}
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
                    value={editData.budgetRange}
                    onChange={(e) => setEditData({ ...editData, budgetRange: e.target.value })}
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
                    {userProfile.budgetRange || "No budget range specified."}
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
                    value={editData.projectTypes}
                    onChange={(e) => setEditData({ ...editData, projectTypes: e.target.value })}
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
                    {userProfile.projectTypes || "No project types specified."}
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
