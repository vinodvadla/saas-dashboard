import { AuthCard } from "@/components/AuthCard";
import { DashboardPreview } from "@/components/DashboardPreview";

const Auth = () => {
  return (
    <div className="h-screen w-full flex">
      {/* Left Side - 50% Width - Green Background with Dashboard Preview */}
      <div className="w-1/2 relative">
        {/* Green Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-zellbee-green via-zellbee-green to-zellbee-green-dark"></div>
        
        {/* Dashboard Preview Content */}
        <div className="relative z-10 h-full">
          <DashboardPreview />
        </div>
      </div>

      {/* Right Side - 50% Width - Full Height - White Background with Auth Form */}
      <div className="w-1/2 bg-white h-full flex items-center justify-center">
        <div className="w-full max-w-lg px-8">
          <AuthCard />
        </div>
      </div>
    </div>
  );
};

export default Auth;