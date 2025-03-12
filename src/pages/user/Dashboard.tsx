import React, { useEffect } from 'react'; // Add useEffect
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, RefreshCcw } from 'lucide-react';
import UserHeader from '@/components/user/Header';
import BidCard from '@/components/user/BidCard';
import ProductList from '@/components/user/ProductList';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const newLocal = useProducts();
  const { featuredProduct, refreshFeaturedProduct } = newLocal;
  // console.log(featuredProduct);
  const navigate = useNavigate();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]); // Add user and navigate as dependencies

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // If there's no user, don't render anything (redirect will happen in useEffect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-betting-background">
      <UserHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-betting-text">Bidding Dashboard</h1>
            <p className="text-muted-foreground">Discover and bid on premium properties</p>
          </div>
          
          <Button 
            variant="outline"
            onClick={handleLogout}
            className="mt-4 md:mt-0"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
        
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Featured Property</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={refreshFeaturedProduct}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
          
          {featuredProduct ? (
            <BidCard product={featuredProduct} />
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No featured property available at the moment</p>
            </Card>
          )
          
          }
          
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4">All Properties</h2>
          <ProductList />
        </section>
      </main>
    </div>
  );
};

export default UserDashboard;

