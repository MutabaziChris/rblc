'use client';

import { usePathname } from 'next/navigation';
import TopHeader from './TopHeader';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Conditionally shows TopHeader, Navbar and Footer - hidden on admin auth pages (login/signup)
 * for a cleaner experience. Admin dashboard still shows them so users can navigate back.
 */
export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminAuthPage =
    pathname === '/admin/login' || pathname === '/admin/signup';

  return (
    <>
      {!isAdminAuthPage && <TopHeader />}
      {!isAdminAuthPage && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!isAdminAuthPage && <Footer />}
    </>
  );
}
