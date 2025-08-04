import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye } from "lucide-react";
import { useState } from "react";

export const AuthCard = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="p-8 bg-white border-0 shadow-none rounded-2xl">
        {/* Logo and Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 rounded-full bg-zellbee-yellow flex items-center justify-center mr-3">
              <div className="w-3 h-3 rounded-full bg-white"></div>
            </div>
            <span className="text-xl font-semibold text-gray-900">Zellbee</span>
          </div>
          
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
              Please login before use
            </h1>
            <p className="text-lg text-gray-600">Zellbee Dashboard</p>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="hello@sileetd.com"
                className="h-12 pl-12 pr-4 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:border-zellbee-green focus:ring-1 focus:ring-zellbee-green transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-12 pl-12 pr-12 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:border-zellbee-green focus:ring-1 focus:ring-zellbee-green transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Sign In Button and Forgot Password on same line */}
          <div className="flex items-center justify-between gap-4">
            <Button 
              type="submit"
              className="flex-1 h-12 bg-zellbee-green hover:bg-zellbee-green-dark text-white font-medium rounded-lg transition-colors duration-200"
            >
              Sign In
            </Button>
            <a
              href="#"
              className="text-sm text-zellbee-green hover:text-zellbee-green-dark font-medium transition-colors whitespace-nowrap"
            >
              Forgot Password?
            </a>
          </div>
        </form>

        {/* Register Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don't have any account?{" "}
            <a
              href="#"
              className="text-zellbee-green hover:text-zellbee-green-dark font-medium transition-colors"
            >
              Register
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};