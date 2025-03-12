
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts, type Product } from '@/contexts/ProductContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import UserHeader from '@/components/user/Header';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { products, placeBid } = useProducts();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
  if (id && products.length > 0) {
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      // ✅ Delay navigation to prevent React warnings
      setTimeout(() => {
        navigate('/user/dashboard');
      }, 100);
    }
  }
}, [id, products, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    setIsSubmitting(true);
    
    try {
      const amount = parseFloat(bidAmount);
      
      if (isNaN(amount) || amount <= product.currentBid) {
        toast({
          title: "Invalid bid",
          description: `Your bid must be higher than $${product.currentBid.toLocaleString()}`,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      const success = placeBid(product.id, amount);
      
      if (success) {
        setProduct({ ...product, currentBid: amount });
        toast({
          title: "Bid placed!",
          description: `You've successfully bid $${amount.toLocaleString()} on ${product.name}`,
        });
        setBidAmount('');
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

  if (!product) {
    return (
      <div className="min-h-screen bg-betting-background flex items-center justify-center">
        <p>Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-betting-background">
      <UserHeader />
      
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/user/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="rounded-lg overflow-hidden shadow-md bg-white mb-6">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-muted-foreground mb-6">{product.description}</p>
            
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="text-sm text-muted-foreground">Starting price</div>
                  <div className="text-xl font-semibold">${product.basePrice.toLocaleString()}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">Current highest bid</div>
                  <div className="text-2xl font-bold text-betting-primary">
                    ${product.currentBid.toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Place Your Bid</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="bid-amount">Your bid amount ($)</Label>
                    <Input 
                      id="bid-amount" 
                      type="number"
                      min={product.currentBid + 1}
                      step="1"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={`Minimum: $${(product.currentBid + 1).toLocaleString()}`}
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
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useProducts, type Product } from '@/contexts/ProductContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent } from '@/components/ui/card';
// import { ArrowLeft } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import UserHeader from '@/components/user/Header';

// const ProductDetail = () => {
//   const { id } = useParams<{ id: string }>();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [bidAmount, setBidAmount] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   const { products } = useProducts();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   useEffect(() => {
//     if (id && products.length > 0) {
//       const foundProduct = products.find(p => p.id === id);
//       if (foundProduct) {
//         setProduct(foundProduct);
//       } else {
//         setTimeout(() => {
//           navigate('/user/dashboard');
//         }, 100);
//       }
//     }
//   }, [id, products, navigate]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!product) return;
    
//     setIsSubmitting(true);

//     try {
//       const amount = parseFloat(bidAmount);
      
//       if (isNaN(amount) || amount <= product.currentBid) {
//         toast({
//           title: "Invalid bid",
//           description: `Your bid must be higher than $${product.currentBid.toLocaleString()}`,
//           variant: "destructive",
//         });
//         setIsSubmitting(false);
//         return;
//       }

//       // ✅ Send Bid to Backend API
//       const response = await fetch(`http://localhost:5241/api/products/${product.id}/bid`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ amount }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to place bid");
//       }

//       setProduct({ ...product, currentBid: amount });  // ✅ Update UI immediately

//       toast({
//         title: "Bid placed!",
//         description: `You've successfully bid $${amount.toLocaleString()} on ${product.name}`,
//       });
//       setBidAmount('');
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to place bid. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!product) {
//     return (
//       <div className="min-h-screen bg-betting-background flex items-center justify-center">
//         <p>Loading product details...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-betting-background">
//       <UserHeader />
      
//       <main className="container mx-auto px-4 py-8">
//         <Button 
//           variant="ghost" 
//           onClick={() => navigate('/user/dashboard')}
//           className="mb-6"
//         >
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Dashboard
//         </Button>
        
//         <div className="grid md:grid-cols-2 gap-8">
//           <div>
//             <div className="rounded-lg overflow-hidden shadow-md bg-white mb-6">
//               <img 
//                 src={product.image} 
//                 alt={product.name} 
//                 className="w-full h-80 object-cover"
//               />
//             </div>
//           </div>
          
//           <div>
//             <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
//             <p className="text-muted-foreground mb-6">{product.description}</p>
            
//             <Card className="mb-6">
//               <CardContent className="p-6">
//                 <div className="mb-4">
//                   <div className="text-sm text-muted-foreground">Starting price</div>
//                   <div className="text-xl font-semibold">${product.basePrice.toLocaleString()}</div>
//                 </div>
                
//                 <div>
//                   <div className="text-sm text-muted-foreground">Current highest bid</div>
//                   <div className="text-2xl font-bold text-betting-primary">
//                     ${product.currentBid.toLocaleString()}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardContent className="p-6">
//                 <h2 className="text-xl font-bold mb-4">Place Your Bid</h2>
                
//                 <form onSubmit={handleSubmit}>
//                   <div className="space-y-2 mb-4">
//                     <Label htmlFor="bid-amount">Your bid amount ($)</Label>
//                     <Input 
//                       id="bid-amount" 
//                       type="number"
//                       min={product.currentBid + 1}
//                       step="1"
//                       value={bidAmount}
//                       onChange={(e) => setBidAmount(e.target.value)}
//                       placeholder={`Minimum: $${(product.currentBid + 1).toLocaleString()}`}
//                       required
//                     />
//                   </div>
                  
//                   <Button 
//                     type="submit"
//                     className="w-full betting-btn-accent"
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? 'Placing bid...' : 'Place Bid'}
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ProductDetail;
