import Loader from "@/components/Loader";
import Index from "@/pages";
import Chargers from "@/pages/Chargers";
import Clients from "@/pages/Clients";
import ClientPage from "@/pages/ClientSinglePage";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";

type Props = {};

function PrivateRoutes() {
  const { user ,loading} = useSelector((state: RootState) => state.auth);
  let navigate = useNavigate();



  if(loading){
    return <Loader/>
  }

  if (!user) {
     navigate("/auth/login");
  }

  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/chargers" element={<Chargers />} />
      <Route path="/clients/:id" element={<ClientPage />} />
    </Routes>
  );
}

export default PrivateRoutes;
