import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, LogOut, Package } from "lucide-react";
import AdminHeader from "@/components/admin/Header";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAddProduct = () => {
    navigate("/admin/add-product");
  };

  // 🔹 Fetch products from backend API
  useEffect(() => {
    fetch("http://localhost:5241/api/products", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}` // Ensure authentication
      },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to fetch products", err));
  }, []);

  if (!user || user.role !== "admin") {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-betting-background">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-betting-text">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your property listings and bids</p>
          </div>

          <div className="flex space-x-4 mt-4 md:mt-0">
            <Button onClick={handleAddProduct} className="betting-btn-accent">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Product
            </Button>

            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Products</CardTitle>
              <CardDescription>Active property listings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Package className="mr-2 h-5 w-5 text-betting-primary" />
                <span className="text-3xl font-bold">{products.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Your Property Listings</h2>
          {products.map((product) => (
            <Card key={product.id} className="mb-4">
              <CardContent>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p>{product.description}</p>
                <p className="text-muted-foreground">Price: ${product.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
