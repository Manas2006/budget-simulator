import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }: { data: { user: User | null } }) => setUser(user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) =>
      setUser(session?.user ?? null)
    );
    return () => sub?.subscription.unsubscribe();
  }, []);

  return user;
} 