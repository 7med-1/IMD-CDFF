'use client';

import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsDarkMode, setIsSidebarCollapsed } from '@/state';
import { Menu, Sun, Moon } from 'lucide-react';
import React, { useEffect } from 'react';
import { Button } from '../Button';
import { useAuth } from '@/app/dashboardwrapper';

function Navbar() {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const toggleSidebar = () =>
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  const toggleDarkMode = () => dispatch(setIsDarkMode(!isDarkMode));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const { logout } = useAuth();

  return (
    <nav className="flex justify-between items-center w-full p-4 bg-white dark:bg-gray-50 shadow-md">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-100"
        >
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-900" />
        </button>
        <span className="text-xl font-bold text-gray-800 dark:text-gray-900">
          2bfutur
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={logout} className="bg-blue-600 hover:bg-blue-700">
          logout
        </Button>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-100"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700 dark:text-gray-900" />
          )}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
