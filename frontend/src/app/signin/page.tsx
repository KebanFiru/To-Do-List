'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export default function SignInPage() {


  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {

      const res = await fetch(`${APIURL}/api/signin`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {

        const errData = await res.json();
        setErrorMsg(errData.message || 'Failed to sign in');
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (typeof window !== 'undefined') {

        localStorage.setItem('token', data.access_token);
      }
      
      router.push('/');
    } 
    catch (error) {
    
      setErrorMsg('Unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
      <form onSubmit={handleSignIn} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username or Email"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="border p-2 rounded"
        />
        {errorMsg && (
          <div className="text-red-600 text-sm font-semibold">{errorMsg}</div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
