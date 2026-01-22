import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import sareeBackground from "@/assets/saree-background.jpg";
import logo from "@/assets/logo.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (email === "sareesbysri3@gmail.com" && password === "Renu@1969") {
      localStorage.setItem("isAuthenticated", "true");
      toast({
        title: "Welcome back!",
        description: "Login successful. Redirecting to dashboard...",
      });
      setTimeout(() => navigate("/dashboard"), 1000);
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* ===== BACKGROUND ===== */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${sareeBackground})` }}
      />
      <div className="absolute inset-0 bg-black/20" />

      {/* ===== LOGIN CARD ===== */}
      <div className="relative z-10 w-full max-w-md px-4 animate-scale-in">
        <div className="rounded-2xl p-8 md:p-10 bg-white/15 backdrop-blur-xl border border-white/25 shadow-2xl">

          {/* ===== FULL CIRCLE LOGO ===== */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden shadow-xl bg-white">
                <img
                  src={logo}
                  alt="Sridevi Collections Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-display font-bold text-white">
              Sridevi Collections
            </h1>
            <p className="text-sm text-white/80 mt-1">
              Premium Textile Billing System
            </p>
          </div>

          {/* ===== FORM ===== */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label className="text-white font-medium">
                Email Address
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="h-12 bg-white/70 backdrop-blur-md border border-white/30 text-black placeholder:text-gray-500"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label className="text-white font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="h-12 pr-12 bg-white/70 backdrop-blur-md border border-white/30 text-black placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-maroon hover:bg-maroon/90 text-white text-base font-semibold rounded-lg shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn size={20} />
                  Sign In
                </div>
              )}
            </Button>
          </form>

          {/* ===== FOOTER ===== */}
          <div className="mt-8 pt-6 border-t border-yellow-400/40 text-center">
            <p className="text-sm font-semibold text-yellow-400">
              Sushvara Block Printing Unit
            </p>
            <p className="text-xs text-yellow-300 mt-1">
              Powered by Milarch.Tech
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
