// React Frontend - BiddingPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const socket = io('http://localhost:8000'); // Connect to FastAPI WebSocket server

const BiddingPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8000/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error('Error fetching product:', err));
  
    const handleBidUpdate = (updatedProduct) => {
      if (updatedProduct.id === parseInt(productId)) {
        setProduct(updatedProduct);
      }
    };
  
    socket.on('updateBid', handleBidUpdate);
  
    return () => {
      socket.off('updateBid', handleBidUpdate); // ✅ Proper cleanup
    };
  }, [productId]);
  

  const handleBid = () => {
    if (!product || !bidAmount || parseFloat(bidAmount) <= product.current_bid) {
      alert('Enter a valid bid higher than the current bid.');
      return;
    }
    setIsSubmitting(true);
    fetch(`http://localhost:8000/api/bid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, bid_amount: parseFloat(bidAmount) })
    })
      .then((res) => res.json())
      .then((data) => {
        socket.emit('newBid', data);
        setBidAmount('');
      })
      .catch((err) => console.error('Error placing bid:', err))
      .finally(() => setIsSubmitting(false));
  };

  if (!product) return <p>Loading product...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <Card className="max-w-xl w-full">
        <CardContent className="p-6">
          <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-md mb-4" />
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-lg font-bold mt-2">Current Bid: ${product.current_bid}</p>
          <div className="mt-4">
            <Input
              type="number"
              placeholder="Enter bid amount"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
            />
            <Button onClick={handleBid} disabled={isSubmitting} className="mt-2 w-full">
              {isSubmitting ? 'Placing bid...' : 'Place Bid'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BiddingPage;
