import liff from "@line/liff";
import { useNavigate, useLocation } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const type = location.state?.type as "employer" | "freelancer" | undefined;

  const handleBack = (): void => {
    navigate("/");
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "'Arial', sans-serif",
        padding: "20px",
      }}
    >
      {/* Login Container */}
      <div
        style={{
          padding: "40px",
          borderRadius: "10px",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        {/* LINE Login Button */}
        <button
          onClick={() => {
            // You can store the type in localStorage or pass it to your backend
            if (type) {
              localStorage.setItem("userType", type);
            }
            liff.login();
          }}
          style={{
            width: "100%",
            backgroundColor: "white",
            border: "2px solid #06C755",
            padding: "15px 20px",
            borderRadius: "8px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            transition: "background-color 0.3s ease",
            fontFamily: "'Arial', sans-serif",
            color: "#06C755",
          }}
          onMouseOver={(e: React.MouseEvent<HTMLButtonElement>): void => {
            e.currentTarget.style.backgroundColor = "#06C755";
            e.currentTarget.style.color = "white";
            e.currentTarget.style.border = "2px solid white";
          }}
          onMouseOut={(e: React.MouseEvent<HTMLButtonElement>): void => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.color = "#06C755";
            e.currentTarget.style.border = "2px solid #06C755";
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Login with LINE{" "}
            {type ? `as ${type.charAt(0).toUpperCase() + type.slice(1)}` : ""}
          </span>
        </button>

        {/* Back Button */}
        <button
          onClick={handleBack}
          style={{
            backgroundColor: "#06C755",
            color: "white",
            border: "2px solid white",
            padding: "12px 20px",
            borderRadius: "50px",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "20px",
            fontFamily: "'Arial', sans-serif",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e: React.MouseEvent<HTMLButtonElement>): void => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#06C755";
            e.currentTarget.style.border = "2px solid #06C755";
          }}
          onMouseOut={(e: React.MouseEvent<HTMLButtonElement>): void => {
            e.currentTarget.style.backgroundColor = "#06C755";
            e.currentTarget.style.color = "white";
            e.currentTarget.style.border = "2px solid white";
          }}
        >
          ←
        </button>
      </div>
    </div>
  );
}
export default LoginPage;
