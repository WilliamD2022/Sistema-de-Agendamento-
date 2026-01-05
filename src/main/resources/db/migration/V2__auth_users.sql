create table if not exists users (
                                     id uuid primary key,
                                     name varchar(120) not null,
    email varchar(160) not null unique,
    password_hash varchar(255) not null,
    role varchar(30) not null,
    created_at timestamp not null
    );

create index if not exists idx_users_email on users(email);
