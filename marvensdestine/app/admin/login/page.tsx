"use client";

import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = '/admin';
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      window.location.href = '/admin';
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={onSubmit} style={{ width: 360, padding: 24, borderRadius: 16, background: 'rgba(16,18,20,0.8)', border: '1px solid rgba(255,255,255,0.12)' }}>
        <h1 style={{ color: '#fff', fontSize: 20, marginBottom: 16 }}>Admin Sign In</h1>
        <label style={{ color: '#ccc', fontSize: 12 }}>Email</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required style={{ width: '100%', margin: '6px 0 12px', padding: '10px 12px', borderRadius: 8 }} />
        <label style={{ color: '#ccc', fontSize: 12 }}>Password</label>
        <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required style={{ width: '100%', margin: '6px 0 12px', padding: '10px 12px', borderRadius: 8 }} />
        {error && <div style={{ color: '#ff6b6b', fontSize: 12, marginBottom: 8 }}>{error}</div>}
        <button disabled={loading} type="submit" style={{ width: '100%', padding: '12px 14px', borderRadius: 10 }}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
          <button type="button" disabled={loading} onClick={onGoogle} style={{ padding: '10px 12px', borderRadius: 10 }}>
            Continue with Google
          </button>
        </div>
        <div style={{ marginTop: 12 }}>
          <Link href="/">← Back to site</Link>
        </div>
      </form>
    </main>
  );
}


