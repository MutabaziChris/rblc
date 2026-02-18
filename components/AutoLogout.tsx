'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

/**
 * Automatically signs out admin users when they navigate to non-admin pages.
 * Keeps admin session active only while browsing within /admin/*.
 */
export default function AutoLogout() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isAdminPage = pathname?.startsWith('/admin');
    const isAuthCallback = pathname === '/auth/callback';

    // Don't sign out when on admin pages or auth callback
    if (isAdminPage || isAuthCallback) return;

    const signOutIfLoggedIn = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await supabase.auth.signOut();
        router.refresh();
      }
    };

    signOutIfLoggedIn();
  }, [pathname, router]);

  return null;
}
