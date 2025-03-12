
import React from 'react';
import { useProducts, type Product } from '@/contexts/ProductContext';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

const AdminProductList = () => {
  const { products } = useProducts();

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No products listed yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
};

const ProductItem = ({ product }: { product: Product }) => {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 h-48 md:h-auto">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <CardContent className="w-full md:w-3/4 p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="text-xl font-bold">{product.name}</h3>
              <p className="text-muted-foreground text-sm mb-2">
                Listed {formatDistanceToNow(new Date(product.createdAt), { addSuffix: true })}
              </p>
              <p className="line-clamp-2 text-sm mb-3">{product.description}</p>
            </div>
            
            <div className="mt-4 md:mt-0 md:text-right">
              <div className="text-muted-foreground text-sm">Base price</div>
              <div className="text-lg font-bold">${product.basePrice.toLocaleString()}</div>
              
              <div className="text-muted-foreground text-sm mt-2">Current bid</div>
              <div className="text-lg font-bold text-betting-primary">
                ${product.currentBid.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default AdminProductList;
