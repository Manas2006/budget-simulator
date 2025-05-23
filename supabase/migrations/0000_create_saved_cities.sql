create table public.saved_cities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  city_slug text not null,
  city_name text not null,
  lat numeric,
  lon numeric,
  rent_snapshot numeric,
  created_at timestamptz default now()
);

alter table saved_cities enable row level security;

create policy "Users can CRUD their own rows"
  on saved_cities for all
  using  ( user_id = auth.uid() )
  with check ( user_id = auth.uid() ); 