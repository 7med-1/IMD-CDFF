'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';
import Navbar from './(components)/Navbar';
import Sidebar from './(components)/Sidebar';
import LoginPage from './login/page';
import { useAppDispatch, useAppSelector } from './redux';
import { setToken } from '@/state';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  isAuth: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuth: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  return (
    <div
      className={`${
        isDarkMode ? 'dark' : 'light'
      } flex bg-gray-50 text-gray-900 w-full min-h-screen`}
    >
      <Sidebar />
      <main
        className={`flex flex-col w-full h-full py-7 px-9 bg-gray-50 ${
          isSidebarCollapsed ? 'md:pl-24' : 'md:pl-72'
        }`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(setToken(token));
      setIsAuth(true);
    }
    setLoading(false);
  }, [dispatch]);


  useEffect(() => {
    if (isRedirecting) {
      const timer = setTimeout(() => setIsRedirecting(false), 300);
      return () => clearTimeout(timer);
    }
  }, [pathname]);


  const login = (token: string) => {
    setIsRedirecting(true);
    localStorage.setItem('token', token);
    dispatch(setToken(token));
    setIsAuth(true);
    router.replace('/'); 
  };


  const logout = () => {

    const confirmLogout = window.confirm('Are you sure you want to log out?');

    if (!confirmLogout) return;

    setIsRedirecting(true); 
    localStorage.removeItem('token');
    dispatch(setToken(null));
    setIsAuth(false);
    router.replace('/login'); 
  };

  // If still checking auth
  if (loading || isRedirecting) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gray-50">
        <div className="text-gray-500 text-lg animate-pulse">
          Loading your dashboard...
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {isAuth ? <DashboardLayout>{children}</DashboardLayout> : <LoginPage />}
    </AuthContext.Provider>
  );
};

export default DashboardWrapper;
