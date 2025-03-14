import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/UserContext"; // Using your existing UserContext
import { ref, get, update } from "firebase/database";
import { database } from "@/firebaseConfig";
import { toast } from "react-toastify";

export default function Account() {
  const { user, setUser } = useAuth(); // Access auth user and update function
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    address: "",
    contact: "",
  });
  const [refresh, setRefresh] = useState(0);
  // 🔹 Fetch user details from Realtime Database after login
  useEffect(() => {
    if (user?.uid) {
      console.log("Fetching profile data for UID:", user.uid); // Debug log
      const userRef = ref(database, `users/${user.uid}`);
  
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            console.log("Profile Data Fetched:", snapshot.val()); // Debug log
            setProfileData(snapshot.val()); // Set profile data
          } else {
            console.warn("No profile data found for user:", user.uid);
          }
        })
        .catch((error) => {
          console.error("Error fetching profile data:", error);
        });
    } else {
      console.warn("No user UID found, skipping fetch.");
    }
  }, [user?.uid]); // Re-run when user changes
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.uid) {
      const userRef = ref(database, `users/${user.uid}`);

      try {
        await update(userRef, profileData); // Update Firebase Realtime Database

        // 🔹 Update user context with new data
        setUser((prevUser) => ({
          ...prevUser,
          ...profileData,
        }));

        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating profile:", error.message);
        toast.error("Error updating profile.");
      }
    } else {
      toast.error("User not found.");
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Profile</CardTitle>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile picture" />
            <AvatarFallback>
  {profileData.name ? profileData.name.charAt(0).toUpperCase() : "?"}
</AvatarFallback>

          </Avatar>
          <div key={refresh}>
            <h2 className="text-2xl font-bold">{profileData.name}</h2>
            <p className="text-muted-foreground">{profileData.email}</p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={profileData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                name="contact"
                value={profileData.contact}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Address</h3>
              <p>{profileData.address}</p>
            </div>
            <div>
              <h3 className="font-semibold">Contact</h3>
              <p>{profileData.contact}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </CardFooter>
    </Card>
  );
}
