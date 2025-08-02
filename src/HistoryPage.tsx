import { BottomNav } from './components/BottomNav';

export const HistoryPage = () => {
  const userType = localStorage.getItem("userType") as "employer" | "freelancer" | null;
  
  return (
    <div style={{
      minHeight: "100vh",
      paddingBottom: "80px", // Space for bottom navigation
      backgroundColor: "#06C755",
      color: "white",
      fontFamily: "'Arial', sans-serif",
    }}>
      <div style={{
        padding: "20px",
        backgroundColor: "#fff",
        color: "#333",
        margin: "20px",
        borderRadius: "15px",
        minHeight: "calc(100vh - 140px)",
      }}>
        <h1 style={{ textAlign: "center", color: "#06C755" }}>Work History</h1>
        <p style={{ textAlign: "center", color: "#666" }}>Your completed projects and work history will appear here.</p>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav userType={userType} />
    </div>
  );
};
