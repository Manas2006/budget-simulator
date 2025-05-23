'use client';

import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { X } from 'lucide-react';
import { User } from '@supabase/supabase-js';

export default function MobileMenu({
  open,
  setOpen,
  user,
  pathname,
}: {
  open: boolean;
  setOpen: (b: boolean) => void;
  user: User | null;
  pathname: string;
}) {
  if (!open) return null;

  const linkCls = (path: string) =>
    `block py-2 text-lg ${
      pathname === path ? 'text-emerald-600' : 'text-gray-800 dark:text-gray-200'
    }`;

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden">
      <aside className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 p-6 shadow-lg">
        <button onClick={() => setOpen(false)} className="mb-6">
          <X className="h-6 w-6" />
        </button>

        <nav className="space-y-3">
          <Link href="/" className={linkCls('/')} onClick={() => setOpen(false)}>
            Home
          </Link>

          {user && (
            <Link
              href="/dashboard"
              className={linkCls('/dashboard')}
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="mt-8 space-y-3">
          {user ? (
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                setOpen(false);
              }}
              className="w-full rounded-md bg-gray-200 py-2 text-center dark:bg-gray-800"
            >
              Log out
            </button>
          ) : (
            <>
              <button
                onClick={() =>
                  supabase.auth.signInWithOAuth({ provider: 'google' })
                }
                className="w-full rounded-md bg-gray-200 py-2 dark:bg-gray-800"
              >
                Log in
              </button>
              <button
                onClick={() =>
                  supabase.auth.signInWithOAuth({ provider: 'google' })
                }
                className="w-full rounded-md bg-emerald-600 py-2 text-white"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </aside>
    </div>
  );
} 