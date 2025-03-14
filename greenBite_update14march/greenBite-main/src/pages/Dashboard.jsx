import { useEffect, useState, useRef } from "react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { differenceInDays, format } from "date-fns";
import { onValue, push, ref, set, update } from "firebase/database";
import { database,auth } from "../firebaseConfig.js";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Cell } from "recharts";


function DashboardPage() {
  const [foodItems, setFoodItems] = useState([]);
  const [expiryAlerts, setExpiryAlerts] = useState([]);
  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  useEffect(() => {
    const foodItemsRef = ref(database, `users/${userId}/foodItems`);
    onValue(foodItemsRef, (snapshot) => {
      const items = [];
      const alerts = [];
      snapshot.forEach((childSnapshot) => {
        const item = { id: childSnapshot.key, ...childSnapshot.val() };
        items.push(item);
        if (item.expiryDate) {
          const daysLeft = differenceInDays(new Date(item.expiryDate), new Date());
          if (daysLeft > 0 && daysLeft <= 7) {
            alerts.push({ message: `${item.name} is expiring in ${daysLeft} days!`, type: "warning" });
          } else if (daysLeft < 0) {
            alerts.push({ message: `${item.name} has expired!`, type: "error" });
          }
        }
      });
      setFoodItems(items);
      setExpiryAlerts(alerts);
    });
  }, [userId]);

  const totalItems = foodItems.length;
  const expiringSoon = foodItems.filter(item => 
    item.expiryDate && 
    differenceInDays(new Date(item.expiryDate), new Date()) > 0 &&
    differenceInDays(new Date(item.expiryDate), new Date()) <= 7
  ).length;
  const expired = foodItems.filter(item => item.expiryDate && new Date(item.expiryDate) < new Date()).length;
  const fresh = totalItems - (expiringSoon + expired);

  const chartData = [
    { name: "Total Items", value: totalItems },
    { name: "Expiring Soon", value: expiringSoon },
    { name: "Expired", value: expired },
    { name: "Fresh", value: fresh }
  ];
  const [sortType, setSortType] = useState("expiryDate");

  // Sorting logic
  const sortedItems = [...foodItems].sort((a, b) => {
    if (sortType === "name") return a.name.localeCompare(b.name);
    if (sortType === "quantity") return b.quantity - a.quantity;
    if (sortType === "expiryDate") return new Date(a.expiryDate) - new Date(b.expiryDate);
    if (sortType === "recentlyAdded") return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

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
                          <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                  </div>
                </header>
    <div className="flex">
      <div className="flex flex-wrap gap-4">
  {/* First row with three cards */}
  <div className="flex w-full gap-4">
  <div className="flex-wrap gap-4">
  </div>
    <Card className="shadow-lg bg-blue-100 flex-1">
      <CardHeader>
        <CardTitle>Total Food Items</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{totalItems}</p>
      </CardContent>
    </Card>
    <Card className="shadow-lg bg-yellow-100 flex-1">
      <CardHeader>
        <CardTitle>Expiring Soon</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{expiringSoon}</p>
      </CardContent>
    </Card>
    <Card className="shadow-lg bg-red-100 flex-1">
      <CardHeader>
        <CardTitle>Expired Items</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{expired}</p>
      </CardContent>
    </Card>
    <Card className="shadow-lg bg-green-100 flex-1">
      <CardHeader>
        <CardTitle>Fresh Items</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{fresh}</p>
      </CardContent>
    </Card>
    <div className="flex-wrap gap-4">
    </div>
  </div>
 

  {/* Second row (Inventory Overview) */}
  <div className="w-full">
 
  <Card>
  <CardHeader>
    <CardTitle>Inventory Overview</CardTitle>
  </CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="value"
          label={{ position: "top", fill: "#333" }} // Shows values on top
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={
                entry.name === "Total Items" ? "#3498db" : 
                entry.name === "Fresh" ? "#2ecc71" : 
                entry.name === "Expiring Soon" ? "#f1c40f" : 
                entry.name === "Expired" ? "#e74c3c" : "#8884d8"
              } 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </CardContent>
</Card>

  </div>

  {/* Third row (Expiring Soon & Expired Items) */}
  <div className="w-full">
    <Card>
      <CardHeader>
        <CardTitle>Expiring Soon & Expired Items</CardTitle>
      </CardHeader>
      <CardContent>
        {expiryAlerts.length > 0 ? (
          <ul className="list-disc pl-6 space-y-2">
            {expiryAlerts.map((alert, index) => (
              <li key={index} className={`text-${alert.type === "error" ? "red" : "yellow"}-600`}>
                {alert.message}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No expiring soon or expired items.</p>
        )}
      </CardContent>
    </Card>
  </div>

  {/* Fourth row (Food Inventory Table) */}
  <div className="w-full">
  <Card>
      <CardHeader >
        <CardTitle>Your Food Inventory</CardTitle>

        {/* Sorting Dropdown */}
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="p-2 border rounded-lg text-sm"
        >
          <option value="expiryDate">Sort by Expiry Date</option>
          <option value="name">Sort by Name</option>
          <option value="quantity">Sort by Quantity</option>
          <option value="recentlyAdded">Recently Added</option>
        </select>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Food Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  {item.expiryDate ? format(new Date(item.expiryDate), "PPP") : "No Date"}
                </TableCell>
                <TableCell>
                  <Badge 
                    className={`
                      ${differenceInDays(new Date(item.expiryDate), new Date()) < 0 ? "bg-red-700 text-white" : 
                      differenceInDays(new Date(item.expiryDate), new Date()) <= 7 ? "bg-yellow-400 text-black" : 
                      "bg-green-800 text-white"}
                    `}
                  >
                    {differenceInDays(new Date(item.expiryDate), new Date()) < 0 ? "Expired" : 
                      differenceInDays(new Date(item.expiryDate), new Date()) <= 7 ? "Expiring Soon" : "Fresh"}
                  </Badge>
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
  </SidebarInset>
  </SidebarProvider>
  );
}

export default DashboardPage;
