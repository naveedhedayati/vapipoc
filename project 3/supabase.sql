-- Drop existing indexes if they exist
drop index if exists public.calls_timestamp_idx;
drop index if exists public.calls_status_idx;

-- Add indexes for better query performance
create index if not exists calls_timestamp_idx on public.calls(timestamp);
create index if not exists calls_status_idx on public.calls(status);

-- Update or create RLS policies
drop policy if exists "Enable all operations for authenticated users" on public.calls;
create policy "Enable all operations for authenticated users"
  on public.calls
  for all
  to authenticated
  using (true)
  with check (true);

-- Enable RLS if not already enabled
alter table public.calls enable row level security;

-- Update table comments
comment on table public.calls is 'Stores outbound call logs made through the VAPI system';
comment on column public.calls.phone_number is 'The phone number that was called';
comment on column public.calls.timestamp is 'When the call was initiated';
comment on column public.calls.status is 'The status of the call (success/error)';