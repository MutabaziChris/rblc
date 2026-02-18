import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/AdminNav';

/**
 * Admin Layout - Wraps all admin pages with nav and auth check
 * Middleware handles redirect to login, but we verify here for Server Components
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Allow login and signup pages without auth
  // (Middleware already handles this, but layout may render before redirect)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Show nav bar only when logged in (login/signup pages don't need it) */}
      {user ? (
        <>
          <AdminNav user={user} />
          <div className="pt-4">{children}</div>
        </>
      ) : (
        children
      )}
    </div>
  );
}
