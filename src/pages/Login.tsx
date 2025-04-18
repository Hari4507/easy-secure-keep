import { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "@/services/authService";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const user = authService.checkAuth();
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isSignUp) {
        await authService.signup(email, password);
        toast({
          title: "Sign up successful",
          description: "Welcome to your password manager!",
        });
      } else {
        await authService.login(email, password);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      }
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: isSignUp ? "Sign up failed" : "Login failed",
        description: error.message,
      });
    }
  };

  const handleGoogleSuccess = (credentialResponse: any) => {
    authService.googleLogin(credentialResponse);
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
