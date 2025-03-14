import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, HandHeart, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleUserClick = (role) => {
    const adminCredentials = role === "admin" ? {
      email: "admin@gmail.com",
      password: "admin"
    } : null;
    
    navigate("/auth", { 
      state: { 
        role,
        adminCredentials 
      } 
    });
  };

  const cards = [
    {
      id: 1,
      role: "user", // Change "User" to "user" (lowercase)
      icon: <User size={48} className="text-blue-500" />,
      desc: "Access as an individual user",
    },
    {
      id: 2,
      role: "ngo", // Change "Ngo" to "ngo" (lowercase)
      icon: <HandHeart size={48} className="text-green-500" />,
      desc: "Access as an NGO representative",
    },
    {
      id: 3,
      role: "admin", // Change "Admin" to "admin" (lowercase)
      icon: <ShieldCheck size={48} className="text-red-500" />,
      desc: "Access as an administrator",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards &&
          cards.map((card) => (    
              <Card
                className="p-6 flex flex-col items-center justify-center space-y-4 shadow-lg hover:shadow-xl transition cursor-pointer"
                onClick={()=>handleUserClick(card.role)}
                key={card.id}
              >
                {card.icon}
                <CardContent className="text-center">
                  <h2 className="text-xl font-semibold">{card.role}</h2>
                  <p className="text-gray-600">{card.desc}</p>
                </CardContent>
              </Card>
          ))}
        
      </div>
    </div>
  );
};

export default RoleSelection;
