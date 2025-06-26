'use client';

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import DateDiv from "../components/DateDiv";

export default function WelcomePage() {
  
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {

    if (typeof window !== 'undefined') {

      const token = localStorage.getItem('token');
      setIsLogged(!!token);
    }
  }, []);

  const handleSignInClick = () => {

    router.push('/signin');
  };

  const handleSignUpClick = () => {

    router.push('/signup');
  };

  const handleLogOutClick = () => {

    if (typeof window !== 'undefined') {

      localStorage.removeItem('token');
    }
    setIsLogged(false);
    router.push('/');
  };

  return (
    
    <>
      <header className="w-full h-16 border-b-2 border-blue-500 bg-white shadow flex justify-end items-center gap-4 px-6">
        {!isLogged ? (
          <>
            <button
              className="border border-blue-500 rounded-xl px-4 py-2 hover:bg-blue-100 transition font-semibold text-blue-600"
              onClick={handleSignInClick}
            >
              Sign in
            </button>
            <button
              className="border border-blue-500 rounded-xl px-4 py-2 hover:bg-blue-100 transition font-semibold text-blue-600"
              onClick={handleSignUpClick}
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            <button
              className="border border-blue-500 rounded-xl px-4 py-2 hover:bg-blue-100 transition font-semibold text-blue-600"
              onClick={handleLogOutClick}
            >
              Log out
            </button>
          </>
        )}
      </header>

      {isLogged ? (
        <main className="flex justify-center mt-8 px-4">
          <div className="w-full max-w-6xl p-6 bg-white border border-blue-200 rounded-lg shadow-md">
            <DateDiv />
          </div>
        </main>
      ) : (
        <div className="flex justify-center items-center h-[calc(100vh-64px)] px-4">
          <p className="text-gray-600 text-lg sm:text-xl font-medium text-center max-w-md">
            Please sign in to view your todo calendar.
          </p>
        </div>
      )}
    </>
  );
}
