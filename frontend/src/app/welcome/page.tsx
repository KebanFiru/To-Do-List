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
      <div className="w-full h-16 border-2 border-blue-500 flex justify-end gap-2 p-1">
        {!isLogged ? (
          <>
            <button
              className="border border-blue-500 rounded-xl w-20 hover:bg-blue-100 transition"
              onClick={handleSignInClick}
            >
              Sign in
            </button>
            <button
              className="border border-blue-500 rounded-xl w-20 hover:bg-blue-100 transition"
              onClick={handleSignUpClick}
            >
              Sign up
            </button>
          </>
        ) : (
          <button
            className="border border-blue-500 rounded-xl w-20 hover:bg-blue-100 transition"
            onClick={handleLogOutClick}
          >
            Log out
          </button>
        )}
      </div>

      {isLogged && (
        <div className="flex gap-10 p-4">
          <div className="w-1/5 flex flex-col gap-5 h-full border border-blue-500 p-2">
            <DateDiv />
          </div>
        </div>
      )}

      {!isLogged && (
        <div className="text-center p-8 text-gray-500">
          Please sign in to view your todo calendar.
        </div>
      )}
    </>
  );
}
