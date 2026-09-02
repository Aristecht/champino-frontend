export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role?: string | null;
}

export interface AuthStore {
  isAuthenticated: boolean;
  user: UserProfile | null;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: UserProfile | null) => void;
  clearAuth: () => void;
}
