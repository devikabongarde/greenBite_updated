import { signIn, signUp } from "@/authService.js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth, database, provider } from "@/firebaseConfig";
import { useAuth } from "@/UserContext";
import { signInWithPopup } from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { useState, useEffect } from "react";  // Add useEffect import
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  const role = location.state?.role || "user";
  const adminCredentials = location.state?.adminCredentials;

  useEffect(() => {
    if (adminCredentials) {
      const emailInput = document.querySelector('input[name="email"]');
      const passwordInput = document.querySelector('input[name="password"]');
      
      if (emailInput && passwordInput) {
        emailInput.value = adminCredentials.email;
        passwordInput.value = adminCredentials.password;
      }
    }
  }, [adminCredentials]);

  // Update the CardTitle and CardDescription section
  <CardHeader>
    <CardTitle>{role.charAt(0).toUpperCase() + role.slice(1)} Authentication</CardTitle>
    <CardDescription>
      {role === "ngo"
        ? "Manage NGO donations and activities."
        : role === "user"
        ? "Access user features."
        : "Admin features"}
    </CardDescription>
  </CardHeader>

  // In handleLogin function, update the navigation logic
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
  
    try {
      // Special handling for admin login
      if (role === "admin") {
        if (email === "admin@gmail.com" && password === "admin") {
          toast.success("Admin logged in successfully");
          setTimeout(() => {
            navigate("/admin");
          }, 1000);
        } else {
          toast.error("Invalid admin credentials");
        }
        setIsLoading(false);
        return;
      }
  
      // Login with email/password
      const result = await signIn(email, password);
      const user = result.user;

      // Handle NGO login
      if (role === "ngo") {
        const approvedNgoRef = ref(database, `ngos/${user.uid}`);
        const approvedNgoData = await get(approvedNgoRef);
        
        if (approvedNgoData.exists()) {
          toast.success("Logged in successfully");
          setTimeout(() => {
            navigate("/ngo");
          }, 1000);
          return;
        }

        const pendingNgoRef = ref(database, `pendingNgos/${user.uid}`);
        const pendingNgoData = await get(pendingNgoRef);
        
        if (pendingNgoData.exists()) {
          toast.error("Your NGO registration is pending approval.");
          setIsLoading(false);
          return;
        }

        toast.error("NGO account not found.");
        setIsLoading(false);
        return;
      }

      // Handle regular user login (no approval needed)
      const userRef = ref(database, `users/${user.uid}`);
      const userData = await get(userRef);
      
      if (userData.exists()) {
        toast.success("Logged in successfully");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        toast.error("User account not found. Please sign up first.");
      }

    } catch (err) {
      toast.error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  // In handleSignUp function, update the navigation logic
  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp(email, password);
      const user = result.user;

      // Check if signing up as NGO or regular user
      if (role === "ngo") {
        // Handle NGO registration
        const pendingNgoRef = ref(database, `pendingNgos/${user.uid}`);
        await set(pendingNgoRef, {
          name,
          email: user.email,
          userId: user.uid,
          role: "ngo",
          createdAt: new Date().toISOString(),
          approved: false,
        });
        toast.success("NGO registration request sent. Please wait for admin approval.");
      } else {
        // Handle regular user registration
        const userRef = ref(database, `users/${user.uid}`);
        await set(userRef, {
          name,
          email: user.email,
          userId: user.uid,
          role: "user",
          createdAt: new Date().toISOString(),
        });
        toast.success("Account created successfully!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (err) {
      toast.error("Failed to create account: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Handle NGO login/signup
      if (role === "ngo") {
        const ngoRef = ref(database, `ngos/${user.uid}`);
        const ngoData = await get(ngoRef);
        
        if (ngoData.exists() && ngoData.val().approved) {
          toast.success("Logged in with Google successfully");
          navigate("/ngo");
          return;
        }

        // Check if pending approval
        const pendingNgoRef = ref(database, `pendingNgos/${user.uid}`);
        const pendingData = await get(pendingNgoRef);
        
        if (!pendingData.exists()) {
          await set(pendingNgoRef, {
            name: user.displayName,
            email: user.email,
            userId: user.uid,
            role: "ngo",
            createdAt: new Date().toISOString(),
            approved: false,
          });
        }
        toast.error("Your NGO registration is pending approval.");
        return;
      }

      // Handle regular user login/signup
      const userRef = ref(database, `users/${user.uid}`);
      const userData = await get(userRef);
      
      if (!userData.exists()) {
        // Create new user account
        await set(userRef, {
          name: user.displayName,
          email: user.email,
          userId: user.uid,
          role: "user",
          createdAt: new Date().toISOString(),
        });
      }
      
      toast.success("Logged in with Google successfully");
      navigate("/dashboard");

    } catch (err) {
      toast.error("Failed to login with Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{role} Authentication</CardTitle>
          <CardDescription>
            {role === "Ngo"
              ? "Manage NGO donations and activities."
              : role === "user"
              ? "Access user features."
              : "Admin features"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <Label>Email</Label>
                <Input name="email" type="email" required />
                <Label>Password</Label>
                <Input name="password" type="password" required />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Please wait..." : "Login"}
                </Button>
                {role !== "admin" && (
                  <Button
                    type="button"
                    className="w-full mt-4"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? "Please wait..." : "Login with Google"}
                  </Button>
                )}
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <Label>{role ? "NGO Name" : "Full Name"}</Label>
                <Input name="name" type="text" required />
                <Label>Email</Label>
                <Input name="email" type="email" required />
                <Label>Password</Label>
                <Input name="password" type="password" required />
                <Label>Confirm Password</Label>
                <Input name="confirmPassword" type="password" required />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Please wait..." : "Sign Up"}
                </Button>
                {role !== "admin" && (
                  <Button
                    type="button"
                    className="w-full mt-4"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? "Please wait..." : "Sign Up with Google"}
                  </Button>
                )}
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default AuthPage;
