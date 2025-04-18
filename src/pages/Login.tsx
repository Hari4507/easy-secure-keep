
import { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (isSignUp) {
      // Check if user already exists
      if (users.some((user: any) => user.email === email)) {
        toast({
          variant: "destructive",
          title: "Email already registered",
          description: "Please login instead",
        });
        return;
      }

      // Add new user
      const newUser = { email, password };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("user", JSON.stringify(newUser));
      toast({
        title: "Sign up successful",
        description: "Welcome to your password manager!",
      });
      navigate("/dashboard");
    } else {
      // Login
      const user = users.find(
        (u: any) => u.email === email && u.password === password
      );
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate("/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password",
        });
      }
    }
  };

  const handleGoogleSuccess = (credentialResponse: any) => {
    localStorage.setItem("user", JSON.stringify(credentialResponse));
    toast({
      title: "Login successful",
      description: "Welcome to your password manager!",
    });
    navigate("/dashboard");
  };

  const handleGoogleError = () => {
    toast({
      variant: "destructive",
      title: "Login failed",
      description: "Please try again",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Lock className="h-6 w-6" />
            Password Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-gray-600 text-center mb-4">
            Securely store and manage your passwords
          </p>
          
          <form onSubmit={handleEmailAuth} className="w-full space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {isSignUp ? "Sign Up" : "Login"}
            </Button>
          </form>

          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm text-gray-500">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />

          <Button
            variant="link"
            onClick={() => setIsSignUp(!isSignUp)}
            className="mt-2"
          >
            {isSignUp
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
