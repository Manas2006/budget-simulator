import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export const supabaseServer = async () => {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string) {
          cookieStore.set({ name, value });
        },
        remove(name: string) {
          cookieStore.delete(name);
        },
      },
    }
  );
}; 