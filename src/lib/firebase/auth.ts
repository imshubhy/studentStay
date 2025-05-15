
// Mock implementation of Firebase Auth functions

import type { User as FirebaseUserType } from 'firebase/auth'; // Keep type for consistency if needed elsewhere

// Define a simpler mock user type or reuse Firebase type if suitable
// Using a custom type for clarity in the mock context
interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null; // Optional photo URL
  // Add other fields as needed by your components (e.g., emailVerified)
}

interface AuthResult {
  user: MockUser | null;
  error: string | null;
}

// In-memory store for the mock user and listeners
let mockCurrentUser: MockUser | null = null;
const authStateListeners: Array<(user: MockUser | null) => void> = [];

// In-memory store for registered users
const registeredUsers: { [email: string]: { passwordHash: string; user: MockUser } } = {};

// Helper to notify listeners
const _notifyListeners = () => {
  // Create a stable copy of the user object before notifying
  const userSnapshot = mockCurrentUser ? { ...mockCurrentUser } : null;
  authStateListeners.forEach(listener => {
    try {
      // Pass the snapshot to avoid potential mutation issues if listener modifies the object
      listener(userSnapshot);
    } catch (e) {
      console.error("Error in auth state listener:", e);
    }
  });
};

// Mock Sign up with email and password
export const signUpWithEmail = async (name: string, email: string, password: string): Promise<AuthResult> => {
  console.log("Mock Sign Up Attempt:", { name, email, password: '***' });
  // Basic validation (optional)
  if (!name || !email || !password || password.length < 6) {
     return { user: null, error: "Sign up failed: Please provide valid name, email, and password (min 6 characters)." };
  }
  // Specific check for the email used in mock login to prevent signup with it
  if (email.toLowerCase() === 'test@example.com') {
    console.warn("Mock Sign Up Failed: Email 'test@example.com' is reserved for mock login.");
    return { user: null, error: "Email already in use. Please choose another email." };
  }
  // Simulate successful signup (user created, but not logged in)
  // Important: Do NOT set mockCurrentUser or notify listeners here.
  const newUser: MockUser = {
    uid: `mock_${Date.now()}`,
    email: email,
    displayName: name,
    photoURL: `https://picsum.photos/seed/${encodeURIComponent(name)}/40/40` // Use encoded name for seed
  };
  console.log("Mock Sign Up Successful (User created, please log in):", newUser);

  // Store the user's credentials (email and password hash) in memory
  registeredUsers[email.toLowerCase()] = {
    passwordHash: password, // In real app, hash the password!
    user: newUser,
  };

  // Return user data, but indicate no active session yet.
  return { user: newUser, error: null };
};

// Mock Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
  console.log("Mock Sign In Attempt:", { email, password: '***' });
  // Use specific mock credentials for testing (case-insensitive email check)
  if (email.toLowerCase() === 'test@example.com' && password === 'password') {
    mockCurrentUser = {
      uid: 'mock_user_123',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: `https://picsum.photos/seed/testuser/40/40`
    };
    _notifyListeners(); // Notify listeners about the new logged-in state
    console.log("Mock Sign In Successful:", mockCurrentUser);
    return { user: mockCurrentUser, error: null };
  }

  // Check if the user exists and the password matches
  const registeredUser = registeredUsers[email.toLowerCase()];
  if (registeredUser && registeredUser.passwordHash === password) {
    mockCurrentUser = registeredUser.user;
    _notifyListeners();
    console.log("Mock Sign In Successful:", mockCurrentUser);
    return { user: mockCurrentUser, error: null };
  } else {
    // Always return the same generic error for failed login attempts
    console.warn("Mock Sign In Failed: Invalid credentials provided.");
    return { user: null, error: 'Invalid credentials. Please check your email and password and try again.' };
  }
};

// Mock Sign out
export const signOutUser = async (): Promise<{ error: string | null }> => {
  console.log("Attempting Mock Sign Out");
  if (mockCurrentUser) {
      mockCurrentUser = null;
      _notifyListeners(); // Notify listeners about the signed-out state
      console.log("Mock Sign Out Successful");
      return { error: null };
  }
   console.log("Mock Sign Out: No user was signed in.");
  return { error: null }; // No error if already signed out
};

// Mock Observer for auth state changes
export const onAuthChanged = (callback: (user: MockUser | null) => void): (() => void) => {
  console.log("Mock Auth Listener Attached");
  // Add the listener
  authStateListeners.push(callback);

  // Immediately call the callback with the current state (use a snapshot)
  const userSnapshot = mockCurrentUser ? { ...mockCurrentUser } : null;
  try {
    // Use setTimeout to ensure this runs after the initial component mount cycle completes
    setTimeout(() => callback(userSnapshot), 0);
  } catch (e) {
    console.error("Error calling auth listener immediately:", e);
  }

  // Return an unsubscribe function
  return () => {
    console.log("Mock Auth Listener Detached");
    const index = authStateListeners.indexOf(callback);
    if (index > -1) {
      authStateListeners.splice(index, 1);
    }
  };
};


// --- Social Logins ---

// Mock Sign in with Google
export const signInWithGoogle = async (): Promise<AuthResult> => {
  console.warn("Attempting Mock Google Sign-In.");
  // Simulate a successful Google sign-in for demonstration
  const googleUser: MockUser = {
      uid: `mock_google_${Date.now()}`,
      email: 'googleuser@example.com',
      displayName: 'Google User',
      photoURL: `https://picsum.photos/seed/googleuser/40/40`
  };
  mockCurrentUser = googleUser;
  _notifyListeners(); // Notify listeners about the new logged-in state
  console.log("Mock Google Sign-In Successful:", googleUser);
  return { user: googleUser, error: null };
};


// Export the User type if needed by other parts of the app that rely on the type signature
// It's good practice to export the type you're using internally for the user object.
export type { MockUser as User };
