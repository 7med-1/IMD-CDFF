/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { Input } from '../(components)/ui/input';
import { Button } from '../(components)/Button';
import { useLoginMutation } from '@/state/api';
import { useAuth } from '../dashboardwrapper';



const LoginPage = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loginApi, { isLoading }] = useLoginMutation();
  const { login } = useAuth();


const handleLogin = async () => {
  try {
    const result = await loginApi({ name, password }).unwrap();
    login(result.token); 
  } catch (err: any) {
    alert(err?.data?.message || 'Invalid credentials');
  }
};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gray-50">
        <div className="text-gray-500 text-lg">Logging in...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-gray-900 justify-center h-screen">
      <div className="flex flex-col p-5 rounded-lg bg-gray-50 w-[300px]">
        <h1 className="text-xl font-semibold text-center mb-4 text-gray-800">
          Dashboard Login
        </h1>

        <Input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 mb-3 border rounded bg-gray-100"
        />

        <Input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 mb-4 border rounded bg-gray-100"
        />

        <Button onClick={handleLogin} disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
