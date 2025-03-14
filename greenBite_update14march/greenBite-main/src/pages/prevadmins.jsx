import React, { useState, useEffect } from "react";
import { database } from "../firebaseConfig";
import { ref, onValue, set, remove } from "firebase/database";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [pendingNgos, setPendingNgos] = useState([]);
  const [approvedNgos, setApprovedNgos] = useState([]);

  useEffect(() => {
    // Fetch Users
    const usersRef = ref(database, "users");
    onValue(usersRef, (snapshot) => {
      const userList = [];
      snapshot.forEach((childSnapshot) => {
        userList.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      setUsers(userList);
    });

    // Fetch Pending NGOs
    const pendingNgosRef = ref(database, "pendingNgos");
    onValue(pendingNgosRef, (snapshot) => {
      const ngoList = [];
      snapshot.forEach((childSnapshot) => {
        ngoList.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      setPendingNgos(ngoList);
    });

    // Fetch Approved NGOs
    const ngosRef = ref(database, "ngos");
    onValue(ngosRef, (snapshot) => {
      const ngoList = [];
      snapshot.forEach((childSnapshot) => {
        ngoList.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      setApprovedNgos(ngoList);
    });
  }, []);

  // Approve NGO
  const handleApproveNgo = async (ngo) => {
    const ngoRef = ref(database, `ngos/${ngo.id}`);
    await set(ngoRef, { ...ngo, approved: true });
    
    // Remove from pending list
    const pendingNgoRef = ref(database, `pendingNgos/${ngo.id}`);
    await remove(pendingNgoRef);
  };

  // Delete NGO
  const handleDeleteNgo = async (ngoId, isPending) => {
    const adminPassword = prompt("Enter Admin Password to delete this NGO:");
    if (adminPassword !== "admin") { // Changed from "admin123" to "admin"
      alert("Incorrect password! Deletion canceled.");
      return;
    }
    const ngoRef = ref(database, `${isPending ? "pendingNgos" : "ngos"}/${ngoId}`);
    await remove(ngoRef);
    alert("NGO deleted successfully!");
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Admin Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="flex gap-4">
            <Card className="shadow-lg bg-blue-100 flex-1">
              <CardHeader><CardTitle>Total Users</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold">{users.length}</p></CardContent>
            </Card>
            <Card className="shadow-lg bg-green-100 flex-1">
              <CardHeader><CardTitle>Approved NGOs</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold">{approvedNgos.length}</p></CardContent>
            </Card>
          </div>

          {/* Pending NGO Approvals */}
          <Card>
            <CardHeader><CardTitle>Pending NGOs</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingNgos.map((ngo) => (
                    <TableRow key={ngo.id}>
                      <TableCell>{ngo.name}</TableCell>
                      <TableCell>{ngo.email}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleApproveNgo(ngo)}>Approve</Button>
                        <Button variant="destructive" onClick={() => handleDeleteNgo(ngo.id, true)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Approved NGOs List */}
          <Card>
            <CardHeader><CardTitle>Approved NGOs</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedNgos.map((ngo) => (
                    <TableRow key={ngo.id}>
                      <TableCell>{ngo.name}</TableCell>
                      <TableCell>{ngo.email}</TableCell>
                      <TableCell>
                        <Button variant="destructive" onClick={() => handleDeleteNgo(ngo.id, false)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminDashboard;
