
"use client";

// Use the mocked User type
import type { User } from '@/lib/firebase/auth';
import { createContext, useEffect, useState, type ReactNode } from 'react';
// Import the mocked auth function
import { onAuthChanged } from '@/lib/firebase/auth';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  isInitialized: boolean; // Added to track if initial auth check is done
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  // Start loading as true, set to false once the initial check is done.
  const [loading, setLoading] = useState(true);
  // Start isInitialized as false, set to true after the first listener callback.
  const [isInitialized, setIsInitialized] = useState(false);


  useEffect(() => {
    // The listener now uses the mocked onAuthChanged
    const unsubscribe = onAuthChanged((currentUser: User | null) => {
      console.log("Auth State Changed (Context):", currentUser);
      setUser(currentUser); // Update the user state
      // Set loading to false and initialized to true after the first check completes
      setLoading(false);
      setIsInitialized(true);
    });

    // Cleanup subscription on unmount
    return () => {
        console.log("Cleaning up Auth Listener (Context)");
        unsubscribe();
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <AuthContext.Provider value={{ user, loading, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};

