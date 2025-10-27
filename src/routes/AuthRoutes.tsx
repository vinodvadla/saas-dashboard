import { Routes, Route, useNavigate } from "react-router-dom";
import Auth from "@/pages/Auth";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import Loader from "@/components/Loader";

const AuthRoutes = () => {
  const { user ,loading} = useSelector((state: RootState) => state.auth);
  let navigate = useNavigate();
  if(loading){
    return <Loader/>
  }
  if (user) {
    navigate("/");
  }
  return (
    <Routes>
      <Route path="/login" element={<Auth />} />
    </Routes>
  );
};

export default AuthRoutes;
