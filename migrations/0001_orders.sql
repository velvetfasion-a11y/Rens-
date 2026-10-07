create table if not exists orders (
  id text primary key,
  created_at timestamptz not null default now(),
  customer_name text not null,
  customer_email text not null,
  address text not null,
  postal text not null,
  city text not null,
  country text not null,
  qty integer not null,
  method text not null,
  goods_kr integer not null,
  delivery_kr integer not null,
  total_kr integer not null
);
