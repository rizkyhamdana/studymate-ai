-- Seed file for StudyMate AI database

-- Insert a default demo user
insert into users (id, name, email)
values (
  '00000000-0000-0000-0000-000000000000',
  'Demo Student',
  'demo@studymate.ai'
)
on conflict (email) do nothing;
