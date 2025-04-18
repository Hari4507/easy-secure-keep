
import { useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSuccess = (credentialResponse: any) => {
    localStorage.setItem("user", JSON.stringify(credentialResponse));
    toast({
      title: "Login successful",
      description: "Welcome to your password manager!",
    });
    navigate("/dashboard");
  };

  const handleError = () => {
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
          <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
