import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const BiddingPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [computerBidCount, setComputerBidCount] = useState(0);
  const [computerBid, setComputerBid] = useState(0);
  const [randomBidCount, setRandomBidCount] = useState(2);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [userTotalBid, setUserTotalBid] = useState(0);
  const [currentBid, setCurrentBid] = useState(localStorage.getItem('currentBid'));
  const [winner, setWinner] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5241/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error('Error fetching product:', err));
  }, [productId]);

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      if (userTotalBid === 0) {
        randomBid();
      }
    }, 3000); 
    return () => clearTimeout(initialTimer);
  }, [userTotalBid]);

  const handleBid = () => {
    if (!product || !bidAmount || parseFloat(bidAmount) <= currentBid) {
      alert('Enter a valid bid higher than the current bid.');
      return;
    }
    setUserTotalBid(userTotalBid + 1);
    setCurrentBid(parseFloat(bidAmount));
    setIsSubmitting(true);

    setTimeout(() => {
      randomBid(); // Computer bids after 1 second
    }, 1000);
  };
  useEffect(() => {
    const maxIncrement = Math.floor(Math.random() * 5) + 1; 
    setRandomBidCount(maxIncrement);
  }, [])

  const randomBid = () => {
    // const maxIncrement = Math.floor(Math.random() * 5) + 1; 
    const maxComputerBid: number = parseInt(currentBid, 10) + 5000; 
    const newBid = Math.floor(Math.random() * maxComputerBid) + 1;
    setCurrentBid(newBid);
    setComputerBid(newBid);
    setComputerBidCount(computerBidCount + 1);
    setIsSubmitting(false);
  };
  useEffect(() => { 
    if(computerBidCount === randomBidCount) {
      setWinner(true);
      localStorage.setItem('currentBid', bidAmount)
      alert('You have won this bid'); 
      navigate('/user/dashboard');
    }
  }, [ computerBidCount ])
  const handleWithdraw = () => {
    setIsWithdrawing(true);
    localStorage.setItem('currentBid', bidAmount);
    setWinner(false);
    alert('You lose this bid');
    navigate('/user/dashboard');
  };

  if (!product) return <p>Loading product...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-purple-600">
      <Card className="max-w-xl w-full shadow-lg rounded-lg">
        <CardContent className="p-6">
          <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-md mb-4" />
          <h1 className="text-3xl font-bold text-white">{product.name}</h1>
          <p className="text-gray-200 mb-2">{product.description}</p>
          <p className="text-xl font-bold text-yellow-300">Current Bid: ${currentBid}</p>
          <p className="text-lg text-red-300 mt-2">Stranger Bid: { computerBid }</p>
          <p className="text-lg text-red-300 mt-2">your bid: { bidAmount }</p>
          <div className="mt-4 space-y-2">
            <Input
              type="number"
              placeholder="Enter bid amount"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="p-2 rounded-lg"
            />
            <Button onClick={handleBid} disabled={isSubmitting} className="w-full bg-green-500 text-white py-2 rounded-lg">
              Place Bid
            </Button>
            <Button onClick={handleWithdraw} disabled={isWithdrawing} className="w-full bg-red-500 text-white py-2 rounded-lg">
              {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BiddingPage;
