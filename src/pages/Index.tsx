
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } else {
      // No user found, redirect to login
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-betting-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-betting-primary">BidHunt</h1>
        <p className="text-xl text-muted-foreground">Redirecting to the appropriate page...</p>
      </div>
    </div>
  );
};

export default Index;
