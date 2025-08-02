import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface JobData {
  title: string;
  description: string;
  category: string;
  budget: string;
  duration: string;
  skills: string;
  location: string;
  urgency: string;
}

function CreateJobPage() {
  const navigate = useNavigate();
  const [jobData, setJobData] = useState<JobData>({
    title: "",
    description: "",
    category: "",
    budget: "",
    duration: "",
    skills: "",
    location: "",
    urgency: "",
  });

  const categories = [
    "Web Development",
    "Mobile Apps",
    "Design",
    "Writing",
    "Marketing",
    "Data Entry",
    "Translation",
    "Video Editing",
    "Other"
  ];

  const urgencyLevels = [
    "Low - 1+ weeks",
    "Medium - 3-7 days", 
    "High - 1-2 days",
    "Urgent - Same day"
  ];

  const handleInputChange = (field: keyof JobData, value: string) => {
    setJobData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!jobData.title || !jobData.description || !jobData.category || !jobData.budget) {
      alert("Please fill in all required fields (Title, Description, Category, Budget)");
      return;
    }

    // Save job data to localStorage (in a real app, this would go to a backend)
    const existingJobs = JSON.parse(localStorage.getItem("jobPostings") || "[]");
    const newJob = {
      ...jobData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      employer: JSON.parse(localStorage.getItem("userProfileData") || "{}"),
      status: "active"
    };
    
    existingJobs.push(newJob);
    localStorage.setItem("jobPostings", JSON.stringify(existingJobs));

    alert("Job posted successfully!");
    navigate("/feeds");
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
          ← Back to Feeds
        </button>
        
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          Create Job
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
          
          {/* Job Title */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "bold",
              color: "#333",
              fontSize: "16px"
            }}>
              Job Title *
            </label>
            <input
              type="text"
              value={jobData.title}
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

          {/* Category */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "bold",
              color: "#333",
              fontSize: "16px"
            }}>
              Category *
            </label>
            <select
              value={jobData.category}
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
                backgroundColor: "white",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#06C755";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e0e0e0";
              }}
            >
              <option value="">Select a category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Job Description */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "bold",
              color: "#333",
              fontSize: "16px"
            }}>
              Job Description *
            </label>
            <textarea
              value={jobData.description}
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
              value={jobData.budget}
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

          {/* Duration */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "bold",
              color: "#333",
              fontSize: "16px"
            }}>
              Project Duration
            </label>
            <input
              type="text"
              value={jobData.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              placeholder="e.g., 2-3 weeks, 1 month, Ongoing"
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

          {/* Skills Required */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "bold",
              color: "#333",
              fontSize: "16px"
            }}>
              Skills Required
            </label>
            <input
              type="text"
              value={jobData.skills}
              onChange={(e) => handleInputChange("skills", e.target.value)}
              placeholder="e.g., React, Node.js, MongoDB (comma separated)"
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
              value={jobData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="e.g., Remote, Tokyo, Japan, or On-site"
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
          <div style={{ marginBottom: "35px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "bold",
              color: "#333",
              fontSize: "16px"
            }}>
              Project Urgency
            </label>
            <select
              value={jobData.urgency}
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
                backgroundColor: "white",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#06C755";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e0e0e0";
              }}
            >
              <option value="">Select urgency level</option>
              {urgencyLevels.map((level, index) => (
                <option key={index} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={handleSubmit}
              style={{
                backgroundColor: "#06C755",
                color: "white",
                border: "none",
                padding: "15px 40px",
                borderRadius: "25px",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
                fontFamily: "'Arial', sans-serif",
                transition: "background-color 0.3s ease",
                width: "100%",
                maxWidth: "300px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#05a847";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#06C755";
              }}
            >
              Post Job
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
