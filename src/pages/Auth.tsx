
import { AuthCard } from "@/components/AuthCard";
import { DashboardPreview } from "@/components/DashboardPreview";

const Auth = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
      <div className="hidden md:flex w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary" />
        <div className="relative z-10 w-full h-full">
          <DashboardPreview />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <AuthCard />
      </div>
    </div>
  );
};

export default Auth;
