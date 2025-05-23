'use client';

import { usePathname } from 'next/navigation';
import NavBar from './NavBar';

export default function NavBarWrapper() {
  const pathname = usePathname();
  const showNavBar = pathname !== '/rent-map';

  if (!showNavBar) return null;
  return <NavBar />;
} 