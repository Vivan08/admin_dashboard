import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const sessionToken = localStorage.getItem('sessionToken');
    
    if (storedUser && sessionToken) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Simulate API call - In production, this would be an actual API request
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock user data
        const mockUsers = [
          {
            id: 1,
            email: 'admin@dashboard.com',
            password: 'admin123',
            name: 'Admin User',
            role: 'admin',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
          },
          {
            id: 2,
            email: 'user@dashboard.com',
            password: 'user123',
            name: 'Regular User',
            role: 'user',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'
          }
        ];

        const foundUser = mockUsers.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser;
          const sessionToken = `session_${Date.now()}_${Math.random()}`;
          
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          localStorage.setItem('sessionToken', sessionToken);
          
          setUser(userWithoutPassword);
          setIsAuthenticated(true);
          resolve(userWithoutPassword);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 800);
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('sessionToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};