import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Product, useProducts } from '@/contexts/ProductContext';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import ProductDetail from '@/pages/user/ProductDetail';

interface BidCardProps {
  product: Product;
}
console.log(ProductDetail);

const BidCard: React.FC<BidCardProps> = ({ product }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { placeBid } = useProducts();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    localStorage.setItem('currentBid', bidAmount);
    try {
      const amount = parseFloat(bidAmount);
      
      if (isNaN(amount) || amount <= (product.currentBid || 0)) {
        toast({
          title: "Invalid bid",
          description: `Your bid must be higher than $${(product.currentBid?.toLocaleString() || '0')}`,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      const success = placeBid(product.id, amount);
      console.log(product.id, amount);
      
      if (success) {
        toast({
          title: "Bid placed!",
          description: `You've successfully bid $${amount.toLocaleString()} on ${product.name}`,
        });
        setBidAmount('');
        setTimeout(() => {
          // return success;
          navigate('/success',{state:success}); 
        }, 1000);
      } else {
        toast({
          title: "Bid failed",
          description: "Unable to place bid. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place bid. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="overflow-hidden betting-card">
      <div className="grid md:grid-cols-2 gap-2">
        <div className="h-64 md:h-auto">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-6 flex flex-col">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
            <p className="text-muted-foreground mb-4">{product.description}</p>
            
            <div className="mb-4">
              <div className="text-muted-foreground">Current bid</div>
              <div className="text-3xl font-bold text-betting-primary">
                ${localStorage.getItem('currentBid') ? localStorage.getItem('currentBid') : product.currentBid?.toLocaleString() || product.price.toLocaleString()}
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="space-y-2 mb-4">
              <Label htmlFor="bid-amount">Your bid amount ($)</Label>
              <Input 
                id="bid-amount" 
                type="number"
                min={product.price ? product.price as number : 1}
                step="1"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                // placeholder={`Minimum: $${(product.price ? product.price  : 1).toLocaleString()}`}
                required
              />
            </div>
            
            <Button 
              type="submit"
              className="w-full betting-btn-accent"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Placing bid...' : 'Place Bid'}
            </Button>
          </form>
        </div>
      </div>
    </Card>
  );
};

export default BidCard;
