import liff from "@line/liff";
import { useLocation, useNavigate } from "react-router-dom";

export const FeedsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const type = localStorage.getItem("userType") || (location.state as { type?: string })?.type;
  return <div>
    <div>FeedsPage</div>
    <div>User Type: {type}</div>
    <div onClick={()=>{
      liff.logout();
      localStorage.removeItem("userType");
      navigate("/");
    }}>Log Out</div>
  </div>;
};
