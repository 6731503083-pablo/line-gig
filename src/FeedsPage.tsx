import liff from "@line/liff";
import { useLocation, useNavigate } from "react-router-dom";

export const FeedsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const type = location.state?.type as "employer" | "freelancer" | undefined;
  return <div>
    <div>FeedsPage</div>
    <div>{type}</div>
    <div onClick={()=>{
      liff.logout();
      localStorage.removeItem("userType");
      navigate("/");
    }}>Log Out</div>
  </div>;
};
