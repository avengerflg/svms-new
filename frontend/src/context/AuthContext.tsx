import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

// Types
interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'security' | 'frontdesk' | 'teacher';
  phone?: string;
  isActive: boolean;
  school: {
    _id: string;
    name: string;
    address: any;
  };
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profileData: any) => Promise<boolean>;
  clearError: () => void;
}

// Action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string; refreshToken: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' };

// Initial state
// Pre-read localStorage values to avoid multiple reads
const storedToken = localStorage.getItem('authToken');
const storedRefreshToken = localStorage.getItem('refreshToken');
const storedUser = localStorage.getItem('user');

// Parse stored user data safely
let parsedUser = null;
if (storedUser) {
  try {
    parsedUser = JSON.parse(storedUser);
  } catch (error) {
    // Clear invalid stored data
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }
}

const initialState: AuthState = {
  user: parsedUser,
  token: storedToken,
  refreshToken: storedRefreshToken,
  isAuthenticated: !!(storedToken && parsedUser),
  isLoading: false, // Start with false to prevent initial render issues
  error: null,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
        isLoading: false, // Clear loading state when clearing errors
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
// interface AuthProviderProps {
//   children: ReactNode;
// }

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing auth on mount
  useEffect(() => {
    let isCancelled = false; // Prevent state updates if component unmounts

    const checkAuth = async () => {
      // If we have stored auth data, we've already set authenticated state in initialState
      if (storedToken && storedUser && parsedUser) {
        try {
          // Verify token is still valid in background (non-blocking)
          const profileResponse = await authAPI.getProfile();

          if (isCancelled) return; // Component unmounted, don't update state

          if (profileResponse.success) {
            // Update user data if needed
            const updatedUser = profileResponse.data.user;
            if (JSON.stringify(updatedUser) !== storedUser) {
              localStorage.setItem('user', JSON.stringify(updatedUser));
              dispatch({
                type: 'UPDATE_USER',
                payload: updatedUser,
              });
            }
            // Stop loading
            dispatch({ type: 'CLEAR_ERROR' });
          } else {
            // Token invalid, logout
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            dispatch({ type: 'LOGOUT' });
          }
        } catch (error) {
          if (isCancelled) return; // Component unmounted, don't update state

          // Token invalid, clear storage and logout
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        // No stored auth, immediately set loading to false
        if (!isCancelled) {
          dispatch({ type: 'LOGOUT' });
        }
      }
    };

    checkAuth();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isCancelled = true;
    };
  }, []); // Empty dependency array - only run on mount

  // Login function
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await authAPI.login({ email, password });

      if (response.success) {
        const { user, token, refreshToken } = response.data;

        // Store in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token, refreshToken },
        });

        toast.success(`Welcome back, ${user.firstName}!`);

        // Don't force redirect here - let React Router handle it
        return true;
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.message });
        toast.error(response.message);
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      toast.error(errorMessage);
      return false;
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    try {
      authAPI.logout();
    } catch (error) {
      // Silent fail for logout API call
    }

    // Clear storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    dispatch({ type: 'LOGOUT' });
    toast.info('Logged out successfully');

    // Redirect to login
    setTimeout(() => {
      window.location.href = '/auth/login';
    }, 1000);
  }, []); // Update profile function
  const updateProfile = useCallback(async (profileData: any): Promise<boolean> => {
    try {
      const response = await authAPI.updateProfile(profileData);

      if (response.success) {
        const updatedUser = response.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
        toast.success('Profile updated successfully');
        return true;
      } else {
        toast.error(response.message);
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      toast.error(errorMessage);
      return false;
    }
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: AuthContextType = useMemo(
    () => ({
      ...state,
      login,
      logout,
      updateProfile,
      clearError,
    }),
    [state, login, logout, updateProfile, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
