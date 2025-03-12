import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const success = await register(name, email, password, role);
  
      if (success) {
        toast({
          title: "Registration successful!",
          description: `Welcome ${role === 'admin' ? 'Admin' : 'User'}! Please log in.`,
        });
  
        setTimeout(() => navigate('/login'), 500);
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-betting-background p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label>Select Role</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="role" 
                      value="user" 
                      checked={role === 'user'} 
                      onChange={() => setRole('user')}
                    />
                    User
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="role" 
                      value="admin" 
                      checked={role === 'admin'} 
                      onChange={() => setRole('admin')}
                    />
                    Admin
                  </label>
                </div>
              </div>
            </CardContent>
            
            {/* Submit Button */}
            <CardFooter>
              <Button 
                className="w-full betting-btn-primary" 
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>
            </CardFooter>

            {/* Login Redirect */}
            <center>
              <p>
                Already have an account?  
                <span 
                  className="text-betting-primary cursor-pointer" 
                  onClick={() => navigate('/login')}
                >
                  Login here
                </span>
              </p>
            </center>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
