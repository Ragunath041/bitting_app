import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useProducts, Product } from '@/contexts/ProductContext';

const ProductList = () => {
  const { products } = useProducts();
  const navigate = useNavigate();

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No properties available for bidding</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onViewDetails={() => navigate(`/user/product/${product.id}`)}
        />
      ))}
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  onViewDetails: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  return (
    <Card className="overflow-hidden betting-card h-full flex flex-col">
      <div className="h-48">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
        
        <div className="mt-auto">
          <div className="text-sm text-muted-foreground">Current bid</div>
          <div className="text-xl font-bold text-betting-primary mb-4">
            ${product.currentBid?.toLocaleString() || product.price.toLocaleString()}
          </div>
          
          <Button 
            onClick={onViewDetails}
            className="w-full betting-btn-secondary"
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductList;
