import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import liff from "@line/liff";

interface OfferData {
  title: string;
  description: string;
  budget: string;
  requirements: string;
  deadline: string;
}

function CreateJobPage() {
  const navigate = useNavigate();
  const [offerData, setOfferData] = useState<OfferData>({
    title: "",
    description: "",
    budget: "",
    requirements: "",
    deadline: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employerData, setEmployerData] = useState<any>(null);

  // Fetch employer data on component mount
  useEffect(() => {
    const fetchEmployerData = async () => {
      try {
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          const response = await fetch("https://line-gig-api.vercel.app/employers");
          if (response.ok) {
            const employers = await response.json();
            const employer = employers.find((emp: any) => emp.lineId === profile.userId);
            setEmployerData(employer);
          }
        }
      } catch (error) {
        console.error("Error fetching employer data:", error);
      }
    };

    fetchEmployerData();
  }, []);

  const handleInputChange = (field: keyof OfferData, value: string) => {
    setOfferData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!offerData.title || !offerData.description || !offerData.budget) {
      alert("Please fill in all required fields (Title, Description, Budget)");
      return;
    }

    if (!employerData) {
      alert("Employer data not found. Please make sure you're logged in as an employer.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create offer via API
      const response = await fetch("https://line-gig-api.vercel.app/api/offers", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: offerData.title,
          description: offerData.description,
          budget: offerData.budget,
          employerId: employerData.lineId,
          requirements: offerData.requirements || "",
          deadline: offerData.deadline || "",
          status: "open"
        }),
      });

      if (response.ok) {
        const newOffer = await response.json();
        console.log("Offer created successfully:", newOffer);
        alert("Offer posted successfully!");
        navigate("/feeds");
      } else {
        const errorData = await response.json();
        console.error("Error creating offer:", errorData);
        alert("Failed to post offer. Please try again.");
      }
    } catch (error) {
      console.error("Error posting offer:", error);
      alert("Failed to post offer. Please try again.");
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
          Create Offer
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
          
          {/* Offer Title */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "bold",
              color: "#333",
              fontSize: "16px"
            }}>
              Offer Title *
            </label>
            <input
              type="text"
              value={offerData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., React Developer for E-commerce Website"
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

          {/* Offer Description */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "bold",
              color: "#333",
              fontSize: "16px"
            }}>
              Offer Description *
            </label>
            <textarea
              value={offerData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the project requirements, goals, and what you're looking for..."
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
              value={offerData.budget}
              onChange={(e) => handleInputChange("budget", e.target.value)}
              placeholder="e.g., $500-1000, ¥50,000-100,000, or Negotiable"
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

          {/* Requirements */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "bold",
              color: "#333",
              fontSize: "16px"
            }}>
              Requirements
            </label>
            <textarea
              value={offerData.requirements}
              onChange={(e) => handleInputChange("requirements", e.target.value)}
              placeholder="Specific skills, experience, or qualifications needed..."
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "10px",
                border: "2px solid #e0e0e0",
                fontSize: "16px",
                fontFamily: "'Arial', sans-serif",
                boxSizing: "border-box",
                outline: "none",
                minHeight: "100px",
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

          {/* Deadline */}
          <div style={{ marginBottom: "35px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "bold",
              color: "#333",
              fontSize: "16px"
            }}>
              Deadline
            </label>
            <input
              type="text"
              value={offerData.deadline}
              onChange={(e) => handleInputChange("deadline", e.target.value)}
              placeholder="e.g., 2024-12-31, In 2 weeks, or Flexible"
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
              {isSubmitting ? "Posting..." : "Post Offer"}
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
            * Required fields
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateJobPage;
