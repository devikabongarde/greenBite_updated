import { useEffect, useState } from "react";
import { database, auth } from "../firebaseConfig";
import { ref, onValue, update } from "firebase/database";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function NGOPage() {
  const [donations, setDonations] = useState([]);
  const [userId, setUserId] = useState(null);
  const [ngoEmail, setNgoEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        setNgoEmail(user.email);
      } else {
        setUserId(null);
        setNgoEmail("");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const donationsRef = ref(database, `ngos/${userId}/donations`);
    onValue(donationsRef, (snapshot) => {
      const items = [];
      snapshot.forEach((childSnapshot) => {
        const item = { id: childSnapshot.key, ...childSnapshot.val() };
        items.push(item);
      });
      setDonations(items);
    });
  }, [userId]);

  const handleAccept = (donationId) => {
    update(ref(database, `ngos/${userId}/donations/${donationId}`), {
      status: "Accepted"
    })
      .then(() => {
        toast.success("Donation accepted!");
      })
      .catch((error) => {
        toast.error("Failed to accept donation: " + error.message);
      });
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      toast.error('Error logging out: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 to-blue-50/50">
      <header className="flex h-16 items-center justify-between px-4 border-b bg-white/80 backdrop-blur-sm">
        <div className="flex-1"></div>
        <div className="flex items-center gap-3 flex-1 justify-center">
          <img 
            src="/icon.png" 
            alt="GreenBite Logo" 
            className="h-8 w-8 object-contain bg-green-800/80 p-1.5 rounded-lg
                       transform transition-all duration-300 hover:scale-105
                       shadow-sm hover:shadow-md"
          />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent
                         transform transition-all duration-300 hover:scale-105">
            NGO Dashboard
          </h1>
        </div>
        <div className="flex-1 flex items-center justify-end gap-4">
          <div className="bg-green-50 px-3 py-1.5 rounded-md border border-green-100">
            <span className="text-sm font-medium text-green-700">{ngoEmail}</span>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="bg-green-600 hover:bg-red-600 text-white px-6 py-2 rounded-md
                           transform transition-all duration-300 ease-in-out
                           hover:scale-105 active:scale-95
                           shadow-md hover:shadow-lg
                           border-none"
          >
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent
                         transform transition-all duration-300 hover:scale-105">
            Donation Requests
          </h1>
          <div className="bg-white/50 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
            <span className="text-sm text-gray-600">Total Donations: </span>
            <span className="font-semibold text-green-700">{donations.length}</span>
          </div>
        </div>
        <ToastContainer position="top-center" />

        <div className="rounded-lg border bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-green-50 to-blue-50">
                <TableHead className="font-semibold py-4">Item Name</TableHead>
                <TableHead className="font-semibold py-4">Donor ID</TableHead>
                <TableHead className="font-semibold py-4">Status</TableHead>
                <TableHead className="font-semibold py-4">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((donation) => (
                <TableRow key={donation.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{donation.itemName}</TableCell>
                  <TableCell>{donation.donorId}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={donation.status === "Accepted" ? "success" : "warning"}
                      className={`${donation.status === "Accepted" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                    >
                      {donation.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {donation.status !== "Accepted" && (
                      <Button 
                        onClick={() => handleAccept(donation.id)}
                        className="bg-green-600 hover:bg-green-700 text-white
                                 transform transition-all duration-200 hover:scale-105"
                      >
                        Accept
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {donations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No donation requests available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default NGOPage;
