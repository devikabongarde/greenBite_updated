// 2nd chance
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { differenceInDays, format, addDays } from "date-fns";
import { onValue, push, ref, set, update } from "firebase/database";
import { Camera, Calendar as CalendarIcon, Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { database, auth } from "../firebaseConfig.js";

function ItemPage() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedItems, setDetectedItems] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [foodItems, setFoodItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    expiryDate: null,
  });

  const user = auth.currentUser;
  const userId = user ? user.uid : null;
  const alertedItemsRef = useRef(new Set());

  useEffect(() => {
    // Cleanup function to stop camera when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  // Update the useEffect hook to fetch data immediately after login
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        const foodItemsRef = ref(database, `users/${currentUser.uid}/foodItems`);
        onValue(foodItemsRef, (snapshot) => {
          const items = [];
          snapshot.forEach((childSnapshot) => {
            const item = { id: childSnapshot.key, ...childSnapshot.val() };
            items.push(item);
          });
          setFoodItems(items);
        });
      } else {
        setFoodItems([]); // Clear items if user is not logged in
      }
    });

    return () => unsubscribe();
  }, []); // Remove userId dependency

  // Remove the food items fetching from camera-related code
  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "environment"
        }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setIsCameraOpen(true);
      await videoRef.current.play();
    } catch (error) {
      toast.error("Failed to access camera: " + error.message);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const captureAndDetect = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      setIsProcessing(true);
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Capture frame
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to blob
      const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg"));
      const formData = new FormData();
      formData.append("image", blob);

      // Send to backend
      const response = await axios.post("http://127.0.0.1:5000/predict", formData);
      
      if (response.data.predictions && response.data.predictions.length > 0) {
        const detectedItem = response.data.predictions[0];
        
        // Add item to Firebase with default expiry date (7 days from now)
        const defaultExpiryDate = format(addDays(new Date(), 7), "yyyy/MM/dd");
        await addDetectedItemToInventory(detectedItem.item, defaultExpiryDate);
        
        toast.success(`Detected and added: ${detectedItem.item}`);
      } else {
        toast.warn("No items detected in image");
      }
    } catch (error) {
      toast.error("Error during detection: " + error.message);
      console.error("Detection error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const addDetectedItemToInventory = async (itemName, expiryDate) => {
    if (!userId) {
      toast.error("Please login to add items");
      return;
    }

    try {
      const foodItemsRef = ref(database, `users/${userId}/foodItems`);
      await push(foodItemsRef, {
        name: itemName,
        quantity: 1,
        expiryDate: expiryDate,
        addedDate: format(new Date(), "yyyy/MM/dd")
      });
      toast.success("Item added to inventory!");
    } catch (error) {
      toast.error("Failed to add item to inventory: " + error.message);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const itemRef = ref(database, `users/${userId}/foodItems/${itemId}`);
      await set(itemRef, null);
      toast.success("Item deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete item: " + error.message);
    }
  };

  const handleEditClick = (item) => {
    setNewItem({
      name: item.name,
      quantity: item.quantity,
      expiryDate: new Date(item.expiryDate),
    });
  };

  const handleUpdateItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.quantity || !newItem.expiryDate) {
      toast.error("Please fill in all fields");
      return;
    }
  
    const formattedExpiryDate = format(newItem.expiryDate, "yyyy/MM/dd");
    const foodItemsRef = ref(database, `users/${userId}/foodItems`);
    const newFoodItemRef = push(foodItemsRef);
  
    set(newFoodItemRef, {
      name: newItem.name,
      quantity: parseInt(newItem.quantity),
      expiryDate: formattedExpiryDate,
    })
      .then(() => toast.success("Food item updated successfully!"))
      .catch((error) => toast.error("Failed to update food item: " + error.message));
  
    setNewItem({ name: "", quantity: "", expiryDate: null });
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.quantity || !newItem.expiryDate) {
      toast.error("Please fill in all fields");
      return;
    }
  
    const formattedExpiryDate = format(newItem.expiryDate, "yyyy/MM/dd");
    const foodItemsRef = ref(database, `users/${userId}/foodItems`);
    const newFoodItemRef = push(foodItemsRef);
  
    set(newFoodItemRef, {
      name: newItem.name,
      quantity: parseInt(newItem.quantity),
      expiryDate: formattedExpiryDate,
    })
      .then(() => toast.success("Food item added successfully!"))
      .catch((error) => toast.error("Failed to add food item: " + error.message));
  
    setNewItem({ name: "", quantity: "", expiryDate: null });
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate)
      return { label: "Unknown", color: "bg-gray-500 text-white" };

    const daysLeft = differenceInDays(new Date(expiryDate), new Date());

    if (daysLeft < 0)
      return { label: "Expired", color: "bg-red-700 text-white" };
    if (daysLeft <= 7)
      return { label: "Expiring Soon", color: "bg-yellow-400 text-black" };

    return { label: "Fresh", color: "bg-green-800 text-white" };
  };

  const toggleAlert = (itemId, currentStatus) => {
    const itemRef = ref(database, `foodItems/${userId}/${itemId}`);
    update(itemRef, { alertEnabled: !currentStatus });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process image");
      }

      const data = await response.json();

      if (data.expiry_date) {
        const expiryDate = new Date(data.expiry_date);
        setNewItem({ ...newItem, expiryDate });
        toast.success("Expiry date extracted successfully!");
      } else {
        toast.error("No expiry date found in the image.");
      }
    } catch (error) {
      toast.error("Failed to process image: " + error.message);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="space-y-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/items">Items</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Food Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <Button
                        onClick={isCameraOpen ? stopCamera : startCamera}
                        className={isCameraOpen ? "bg-red-500" : ""}
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        {isCameraOpen ? "Stop Camera" : "Start Camera"}
                      </Button>
                      {isCameraOpen && (
                        <Button
                          onClick={captureAndDetect}
                          disabled={isProcessing}
                        >
                          {isProcessing ? "Processing..." : "Detect"}
                        </Button>
                      )}
                    </div>
                    
                    <div className="relative">
                      <video
                        ref={videoRef}
                        className={`w-full max-w-[640px] ${isCameraOpen ? "" : "hidden"}`}
                        autoPlay
                        playsInline
                        muted
                      />
                      <canvas
                        ref={canvasRef}
                        className="hidden"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Add New Food Item</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveItem} className="space-y-4">
                    <div className="max-w-2xl">
                      <div>
                        <Label htmlFor="itemName">Food Item Name</Label>
                        <Input
                          id="itemName"
                          value={newItem.name}
                          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                          placeholder="Enter food item name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={newItem.quantity}
                          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                          placeholder="Number of items"
                        />
                      </div>
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={`w-full justify-start text-left font-normal ${
                                !newItem.expiryDate && "text-muted-foreground"
                              }`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {newItem.expiryDate ? format(newItem.expiryDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={newItem.expiryDate}
                              onSelect={(date) => setNewItem({ ...newItem, expiryDate: date })}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label htmlFor="imageUpload">Upload Expiry Date Image</Label>
                        <Input
                          id="imageUpload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      Add Food Item
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Food Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Food Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {foodItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            {item.expiryDate ? format(new Date(item.expiryDate), "PPP") : "No Date"}
                          </TableCell>
                          <TableCell>
                            <Badge className={getExpiryStatus(item.expiryDate).color}>
                              {getExpiryStatus(item.expiryDate).label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              className="mr-2 hover:bg-blue-200 hover:text-white"
                              onClick={() => handleEditClick(item)}
                            >
                              ✏️
                            </Button>
                            <Button
                              variant="outline"
                              className="hover:bg-red-200 hover:text-white"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="text-red-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" />
      </div>
    </SidebarProvider>
  );
}

export default ItemPage;
