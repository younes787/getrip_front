import React, {
    ReactNode,
    createContext,
    useContext,
    useState,
  } from "react";
import { authLogin } from "../Services";
  
  type User = {
    username: string;
    password: string;
  };
  
  type AuthContextType = {
    user: User | any;
    login: (userData: User) => any;
    logout: () => void;
  };
  interface AuthProviderProps {
    children: ReactNode;
  }
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  export const AuthProvider: any = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<any>(() => {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    });
    const login = async (userData: User) => {
      try {
        const response = await authLogin(userData);
        const accessToken = response.data.token;
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(response));
        setUser(JSON.parse(localStorage.getItem("user") as any).isSuccess);
        if (response.data.role === 'Administrator') {
          window.location.href = "/dashboard";
        } else if (response.data.role === 'Client' || response.data.role === 'Service Provider') {
          window.location.href = "/profile";
        } else {
          
        }
      } catch (e) {
        window.location.href = "/";
      }
    };
    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      window.location.href = "/";
    };
    return (
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };
  