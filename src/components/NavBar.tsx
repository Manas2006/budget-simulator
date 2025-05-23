'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/hooks/useUser';
import { Menu } from 'lucide-react';
import MobileMenu from './MobileMenu';

export default function NavBar() {
  const user = useUser();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkCls = (path: string) =>
    `transition-colors duration-200 ${
      pathname === path
        ? 'text-emerald-600'
        : 'text-gray-800 hover:text-emerald-600 dark:text-gray-200 dark:hover:text-emerald-400'
    }`;

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full backdrop-blur-md bg-white/60 dark:bg-gray-900/50 shadow-md transition-all duration-300 ${
          isScrolled ? 'h-14' : 'h-16'
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-xl font-semibold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Budget Simulator
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/" className={linkCls('/')}>Home</Link>
              {user && (
                <Link href="/dashboard" className={linkCls('/dashboard')}>
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="hidden items-center space-x-4 md:flex">
            {user ? (
              <button
                onClick={() => supabase.auth.signOut()}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                Log out
              </button>
            ) : (
              <>
                <button
                  onClick={() =>
                    supabase.auth.signInWithOAuth({ provider: 'google' })
                  }
                  className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  Log in
                </button>
                <button
                  onClick={() =>
                    supabase.auth.signInWithOAuth({ provider: 'google' })
                  }
                  className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  Sign up
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      <MobileMenu
        open={isMobileMenuOpen}
        setOpen={setIsMobileMenuOpen}
        user={user}
        pathname={pathname}
      />
    </>
  );
} 