import { useEffect, useState } from "react";
import { database, auth } from "../firebaseConfig";
import { ref, onValue, push, set, update } from "firebase/database";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

function DonationPage() {
  const [foodItems, setFoodItems] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [selectedNgo, setSelectedNgo] = useState("");
  const [donationStatus, setDonationStatus] = useState({});
  const [userId, setUserId] = useState(null);

  // Check for authenticated user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch food items & NGOs when userId is available
  useEffect(() => {
    if (!userId) return;

    const foodItemsRef = ref(database, `users/${userId}/foodItems`);
    onValue(foodItemsRef, (snapshot) => {
      const items = [];
      snapshot.forEach((childSnapshot) => {
        const item = { id: childSnapshot.key, ...childSnapshot.val() };
        items.push(item);
      });
      setFoodItems(items);
    });

    const ngosRef = ref(database, `ngos`);
    onValue(ngosRef, (snapshot) => {
      const ngosList = [];
      snapshot.forEach((childSnapshot) => {
        ngosList.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      setNgos(ngosList);
    });
  }, [userId]);

  const handleDonate = (itemId, itemName) => {
    if (!selectedNgo) {
      toast.error("Please select an NGO to donate to.");
      return;
    }

    const donationRef = ref(database, `ngos/${selectedNgo}/donations`);
    const newDonationRef = push(donationRef);

    set(newDonationRef, {
      donorId: userId,
      itemName,
      status: "Pending"
    })
      .then(() => {
        update(ref(database, `users/${userId}/foodItems/${itemId}`), {
          status: "In Progress"
        });
        setDonationStatus((prev) => ({ ...prev, [itemId]: "In Progress" }));
        toast.success("Donation request sent successfully!");
      })
      .catch((error) => {
        toast.error("Failed to donate item: " + error.message);
      });
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Donation</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Donate Food Items</h1>

          {/* NGO Selection Dropdown */}
          <div className="mb-4">
            <label className="block font-semibold">Select NGO:</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={selectedNgo}
              onChange={(e) => setSelectedNgo(e.target.value)}
            >
              <option value="">Select NGO</option>
              {ngos.map((ngo) => (
                <option key={ngo.id} value={ngo.id}>
                  {ngo.name}
                </option>
              ))}
            </select>
          </div>

          <ToastContainer position="top-center" />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Food Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {foodItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.expiryDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        donationStatus[item.id] === "In Progress"
                          ? "warning"
                          : "default"
                      }
                    >
                      {donationStatus[item.id] || "Available"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleDonate(item.id, item.name)}>
                      Donate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DonationPage;
