import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      `404 Error: User attempted to access non-existent route: ${location.pathname}`
    );
  }, [location.pathname]);

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200",
        "animate-fade-in"
      )}
    >
      <div className="text-center space-y-6 p-6 max-w-md mx-auto">
        {/* Icon */}
        <div className="flex justify-center">
          <AlertTriangle
            className="h-16 w-16 text-red-500 animate-pulse"
            aria-hidden="true"
          />
        </div>

        <h1 className="text-5xl font-bold text-gray-800 tracking-tight">404</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button
            className={cn(
              "mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg",
              "transition-all duration-300 hover:shadow-lg hover:scale-105"
            )}
          >
            Return to Dashboard
          </Button>
        </Link>
      </div>

      <div className="absolute bottom-4 text-center text-sm text-gray-500">
        <p>AMC Dashboard | {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default NotFound;