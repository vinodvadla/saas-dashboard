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
      <Card className="p-6 sm:p-8 bg-card text-card-foreground border border-border shadow-none rounded-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-3">
              <div className="w-3 h-3 rounded-full bg-white"></div>
            </div>
            <span className="text-xl font-semibold text-foreground">Zellbee</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-semibold leading-tight text-foreground">
              Please login before use
            </h1>
            <p className="text-lg text-muted-foreground">Zellbee Dashboard</p>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="hello@sileetd.com"
                className="h-12 pl-12 pr-4 rounded-lg bg-background text-foreground placeholder:text-muted-foreground border border-input focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-muted-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-12 pl-12 pr-12 rounded-lg bg-background text-foreground placeholder:text-muted-foreground border border-input focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Sign In & Forgot Password */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Button
              type="submit"
              className="h-12 w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors duration-200"
            >
              Sign In
            </Button>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:underline font-medium text-center sm:text-left"
            >
              Forgot Password?
            </a>
          </div>
        </form>

        {/* Register */}
        <div className="mt-8 text-center">
          <p className="text-sm text-foreground">
            Don&apos;t have an account?{" "}
            <a
              href="#"
              className="text-muted-foreground hover:underline font-medium transition-colors"
            >
              Register
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};
