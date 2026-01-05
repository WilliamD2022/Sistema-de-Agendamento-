insert into users (id, name, email, password_hash, role, created_at)
select 'c8f2b2a1-6cc8-4e56-9a1e-3c6a0aa5f2b1', 'Admin', 'admin@agenda.com',
       '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'ADMIN', now()
where not exists (select 1 from users where email = 'admin@agenda.com');
