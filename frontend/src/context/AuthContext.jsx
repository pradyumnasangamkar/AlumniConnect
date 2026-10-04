import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * AuthContext - Global state management for user authentication.
 *
 * React Context allows us to share state (user data) across all components
 * without passing props through every level.
 *
 * Interview explanation:
 *   "I used React Context to manage authentication state globally.
 *    After login, the user object (id, name, role) is stored in both
 *    localStorage (persists after refresh) and React state (for reactivity).
 *    Any component can access the logged-in user using the useAuth() hook."
 *
 * Why NOT Redux?
 *   "For a project of this scale, React Context + useState is sufficient.
 *    Redux would be overkill and harder to explain in an interview."
 */

// Step 1: Create the Context
const AuthContext = createContext(null);

// Step 2: Create the Provider component
export function AuthProvider({ children }) {
  /**
   * useState: Initializes user state.
   * On page refresh, we read from localStorage to restore the session.
   * This is why we don't get logged out on every page refresh.
   */
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('alumniconnect_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  /**
   * login: Called after successful API login.
   * Saves user data to both state (reactive) and localStorage (persistent).
   */
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('alumniconnect_user', JSON.stringify(userData));
  };

  /**
   * logout: Clears user data from state and localStorage.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('alumniconnect_user');
  };

  // Helper computed values for easy role checking
  const isAdmin = user?.role === 'ADMIN';
  const isAlumni = user?.role === 'ALUMNI';
  const isStudent = user?.role === 'STUDENT';
  const isLoggedIn = user !== null;

  // The value provided to all child components
  const value = {
    user,
    login,
    logout,
    isAdmin,
    isAlumni,
    isStudent,
    isLoggedIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth: Custom hook to consume AuthContext.
 * Any component can call useAuth() to get user data and auth functions.
 *
 * Interview explanation:
 *   "I created a custom hook useAuth() that wraps useContext(AuthContext).
 *    This is a common React pattern that makes it clean and reusable."
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
