import React, { useState, useEffect } from "react";
import { database } from "../firebaseConfig";
import { ref, onValue, set, remove } from "firebase/database";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendApprovalEmail } from '@/utils/emailService';
// Remove this duplicate import
// import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [pendingNgos, setPendingNgos] = useState([]);
  const [approvedNgos, setApprovedNgos] = useState([]);
  const navigate = useNavigate();

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
    try {
      // First approve the NGO in database
      const ngoRef = ref(database, `ngos/${ngo.id}`);
      await set(ngoRef, { ...ngo, approved: true });
      
      // Remove from pending list
      const pendingNgoRef = ref(database, `pendingNgos/${ngo.id}`);
      await remove(pendingNgoRef);
  
      // Send approval email
      const emailSent = await sendApprovalEmail(ngo.email);
      
      if (emailSent) {
        toast.success('NGO approved and notification email sent successfully!');
      } else {
        toast.warning('NGO approved but failed to send notification email.');
      }
    } catch (error) {
      console.error('Error in NGO approval process:', error);
      toast.error('Failed to approve NGO. Please try again.');
    }
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

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/role');
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
            Admin Dashboard
          </h1>
        </div>
        <div className="flex-1 flex items-center justify-end gap-4">
          <div className="bg-green-50 px-3 py-1.5 rounded-md border border-green-100">
            <span className="text-sm font-medium text-green-700">admin@gmail.com</span>
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
        <div className="grid grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50">
              <CardTitle className="text-blue-700">Total Users</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-4xl font-bold text-blue-600">{users.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50">
              <CardTitle className="text-green-700">Approved NGOs</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-4xl font-bold text-green-600">{approvedNgos.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending NGO Approvals */}
        <div className="rounded-lg border bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="p-4 border-b bg-gradient-to-r from-yellow-50 to-yellow-100/50">
            <h2 className="text-xl font-semibold text-yellow-700">Pending NGOs</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-yellow-50 to-yellow-100/50">
                <TableHead className="font-semibold py-4">Name</TableHead>
                <TableHead className="font-semibold py-4">Email</TableHead>
                <TableHead className="font-semibold py-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingNgos.map((ngo) => (
                <TableRow key={ngo.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{ngo.name}</TableCell>
                  <TableCell>{ngo.email}</TableCell>
                  <TableCell className="space-x-2">
                    <Button 
                      onClick={() => handleApproveNgo(ngo)}
                      className="bg-green-600 hover:bg-green-700 text-white
                               transform transition-all duration-200 hover:scale-105"
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => handleDeleteNgo(ngo.id, true)}
                      className="bg-red-600 hover:bg-red-700 text-white
                               transform transition-all duration-200 hover:scale-105"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Approved NGOs List */}
        <div className="rounded-lg border bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="p-4 border-b bg-gradient-to-r from-green-50 to-green-100/50">
            <h2 className="text-xl font-semibold text-green-700">Approved NGOs</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-green-50 to-green-100/50">
                <TableHead className="font-semibold py-4">Name</TableHead>
                <TableHead className="font-semibold py-4">Email</TableHead>
                <TableHead className="font-semibold py-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvedNgos.map((ngo) => (
                <TableRow key={ngo.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{ngo.name}</TableCell>
                  <TableCell>{ngo.email}</TableCell>
                  <TableCell>
                    <Button 
                      variant="destructive" 
                      onClick={() => handleDeleteNgo(ngo.id, false)}
                      className="bg-red-600 hover:bg-red-700 text-white
                               transform transition-all duration-200 hover:scale-105"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default AdminDashboard;
