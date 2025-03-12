
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AdminHeader = () => {
  const { user } = useAuth();

  return (
    <header className="bg-betting-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/admin/dashboard" className="text-xl font-bold">
              BidHunt Admin
            </Link>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm mr-2">
              {user?.name || 'Admin'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
