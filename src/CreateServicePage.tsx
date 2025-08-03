import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import liff from "@line/liff";

interface ServiceData {
  title: string;
  description: string;
  budget: string;
  category: string;
  skills: string;
  duration: string;
  location: string;
  urgency: string;
}

function CreateServicePage() {
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState<ServiceData>({
    title: "",
    description: "",
    budget: "",
    category: "",
    skills: "",
    duration: "",
    location: "",
    urgency: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [freelancerData, setFreelancerData] = useState<any>(null);

  // Fetch freelancer data on component mount
  useEffect(() => {
    const fetchFreelancerData = async () => {
      try {
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          const response = await fetch("https://line-gig-api.vercel.app/freelancers");
          if (response.ok) {
            const freelancers = await response.json();
            const freelancer = freelancers.find((free: any) => free.lineId === profile.userId);
            setFreelancerData(freelancer);
          }
        }
      } catch (error) {
        console.error("Error fetching freelancer data:", error);
      }
    };

    fetchFreelancerData();
  }, []);

  const handleInputChange = (field: keyof ServiceData, value: string) => {
    setServiceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!serviceData.title || !serviceData.description || !serviceData.budget) {
      alert("Please fill in all required fields (Title, Description, Budget)");
      return;
    }

    if (!freelancerData) {
      alert("Freelancer data not found. Please make sure you're logged in as a freelancer.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create service via API
      const response = await fetch("https://line-gig-api.vercel.app/api/services", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: serviceData.title,
          description: serviceData.description,
          budget: serviceData.budget,
          freelancerId: freelancerData.lineId,
          category: serviceData.category || "General",
          skills: serviceData.skills ? serviceData.skills.split(",").map(skill => skill.trim()) : [],
          duration: serviceData.duration || "",
          location: serviceData.location || "",
          urgency: serviceData.urgency || "",
        }),
      });

      if (response.ok) {
        const newService = await response.json();
        console.log("Service created successfully:", newService);
        alert("Service posted successfully!");
        navigate("/feeds");
      } else {
        const errorData = await response.json();
        console.error("Error creating service:", errorData);
        alert("Failed to post service. Please try again.");
      }
    } catch (error) {
      console.error("Error posting service:", error);
      alert("Failed to post service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        fontFamily: "'Arial', sans-serif",
        backgroundColor: "#06C755",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
          color: "white",
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
          Create Service
        </h1>
        
        <div style={{ width: "100px" }}></div> {/* Spacer for centering */}
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#fff",
          margin: "0 20px 20px 20px",
          borderRadius: "15px 15px 0 0",
          padding: "30px 20px",
          color: "#333",
          paddingBottom: "40px",
        }}
      >
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
          
          {/* Service Title */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "bold",
              color: "#333",
              fontSize: "16px"
            }}>
              Service Title *
            </label>
            <input
              type="text"
              value={serviceData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., Professional Logo Design"
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "10px",
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
          </div>

          {/* Service Description */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "bold",
              color: "#333",
              fontSize: "16px"
            }}>
              Service Description *
            </label>
            <textarea
              value={serviceData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe what you offer, your process, what's included..."
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "10px",
                border: "2px solid #e0e0e0",
                fontSize: "16px",
                fontFamily: "'Arial', sans-serif",
                boxSizing: "border-box",
                outline: "none",
                minHeight: "120px",
                resize: "vertical",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#06C755";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e0e0e0";
              }}
            />
          </div>

          {/* Budget */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "bold",
              color: "#333",
              fontSize: "16px"
            }}>
              Budget *
            </label>
            <input
              type="text"
              value={serviceData.budget}
              onChange={(e) => handleInputChange("budget", e.target.value)}
              placeholder="e.g., $50, $100"
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "10px",
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
          </div>

          {/* Category */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "bold",
              color: "#333",
              fontSize: "16px"
            }}>
              Category
            </label>
            <select
              value={serviceData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "10px",
                border: "2px solid #e0e0e0",
                fontSize: "16px",
                fontFamily: "'Arial', sans-serif",
                boxSizing: "border-box",
                outline: "none",
                transition: "border-color 0.3s ease",
                backgroundColor: "white",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#06C755";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e0e0e0";
              }}
            >
              <option value="">Select a category</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="Design">Design</option>
              <option value="Writing">Writing</option>
              <option value="Marketing">Marketing</option>
              <option value="Wiring">Wiring</option>
              <option value="Plumbing">Plumbing</option>
              <option value="House Keeping">House Keeping</option>
              <option value="Home moving">Home moving</option>
              <option value="Gardening">Gardening</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Skills */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "bold",
              color: "#333",
              fontSize: "16px"
            }}>
              Skills & Technologies
            </label>
            <input
              type="text"
              value={serviceData.skills}
              onChange={(e) => handleInputChange("skills", e.target.value)}
              placeholder="e.g., JavaScript, Figma"
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "10px",
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
          </div>

          {/* Location */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "bold",
              color: "#333",
              fontSize: "16px"
            }}>
              Location
            </label>
            <input
              type="text"
              value={serviceData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="e.g., Remote, Tokyo, New York, Worldwide"
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "10px",
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
          </div>

          {/* Urgency */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "bold",
              color: "#333",
              fontSize: "16px"
            }}>
              Urgency
            </label>
            <select
              value={serviceData.urgency}
              onChange={(e) => handleInputChange("urgency", e.target.value)}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "10px",
                border: "2px solid #e0e0e0",
                fontSize: "16px",
                fontFamily: "'Arial', sans-serif",
                boxSizing: "border-box",
                outline: "none",
                transition: "border-color 0.3s ease",
                backgroundColor: "white",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#06C755";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e0e0e0";
              }}
            >
              <option value="">Select urgency level</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          {/* Duration */}
          <div style={{ marginBottom: "35px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "bold",
              color: "#333",
              fontSize: "16px"
            }}>
              Duration
            </label>
            <input
              type="text"
              value={serviceData.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              placeholder="e.g., 1 week, 2-4 weeks"
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "10px",
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
          </div>

          {/* Submit Button */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                backgroundColor: isSubmitting ? "#ccc" : "#06C755",
                color: "white",
                border: "none",
                padding: "15px 40px",
                borderRadius: "25px",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontFamily: "'Arial', sans-serif",
                transition: "background-color 0.3s ease",
                width: "100%",
                maxWidth: "300px",
              }}
              onMouseOver={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = "#05a847";
                }
              }}
              onMouseOut={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = "#06C755";
                }
              }}
            >
              {isSubmitting ? "Publishing..." : "Publish Service"}
            </button>
          </div>

          {/* Required Fields Note */}
          <div style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "14px",
            color: "#666",
            fontStyle: "italic"
          }}>
            * Required fields (Title, Description, Budget)
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateServicePage;
