import React, { createContext, useState, useContext, useEffect } from 'react';

export type Product = {
  price: unknown;
  id: string;
  name: string;
  description: string;
  basePrice: number;
  currentBid: number;
  image: string;
  createdAt: string;
  createdBy: string;
};

type ProductContextType = {
  products: Product[];
  featuredProduct: Product | null;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  placeBid: (productId: string, amount: number) => boolean;
  refreshFeaturedProduct: () => void;
};

// Mock initial products
// const INITIAL_PRODUCTS: Product[] = [
//   {
//     id: '1',
//     name: 'Luxury Apartment in City Center',
//     description: 'A beautiful 3-bedroom apartment with stunning city views and modern amenities.',
//     basePrice: 250000,
//     currentBid: 250000,
//     image: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//     createdAt: new Date().toISOString(),
//     createdBy: '1',
//   },
//   {
//     id: '2',
//     name: 'Beach House Property',
//     description: 'A serene beachfront property with direct access to white sandy beaches.',
//     basePrice: 350000,
//     currentBid: 355000,
//     image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//     createdAt: new Date().toISOString(),
//     createdBy: '1',
//   },
//   {
//     id: '3',
//     name: 'Mountain Cabin Retreat',
//     description: 'Cozy wooden cabin surrounded by pine trees with breathtaking mountain views.',
//     basePrice: 175000,
//     currentBid: 180000,
//     image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//     createdAt: new Date().toISOString(),
//     createdBy: '1',
//   },
// ];

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Fetch products from backend API
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5241/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Set a random featured product initially
    if (products.length > 0 && !featuredProduct) {
      refreshFeaturedProduct();
    }
  }, [products]);

  const addProduct = (newProduct: Omit<Product, 'id' | 'createdAt' | 'currentBid'>) => {
    const product: Product = {
      ...newProduct,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      currentBid: newProduct.basePrice, // Initialize currentBid with basePrice
    };
    
    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    localStorage.setItem('bettingAppProducts', JSON.stringify(updatedProducts));
  };

  const placeBid = (productId: string, amount: number): boolean => {
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      console.error("Product not found");
      return false;
    }

    if (amount <= product.currentBid) {
      console.error("Bid amount must be greater than the current bid");
      return false;
    }
    
    const updatedProducts = products.map(p => 
      p.id === productId ? { ...p, currentBid: amount } : p
    );
    
    setProducts(updatedProducts);
    
    if (featuredProduct?.id === productId) {
      setFeaturedProduct({ ...featuredProduct, currentBid: amount });
    }
    
    localStorage.setItem('bettingAppProducts', JSON.stringify(updatedProducts));
    return true;
  };

  const refreshFeaturedProduct = () => {
    if (products.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * products.length);
    setFeaturedProduct(products[randomIndex]);
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      featuredProduct, 
      addProduct, 
      placeBid,
      refreshFeaturedProduct
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

