create table customers (
                           id uuid primary key,
                           name varchar(120) not null,
                           phone varchar(30),
                           email varchar(160),
                           created_at timestamp not null
);

create table services (
                          id uuid primary key,
                          name varchar(120) not null,
                          duration_minutes int not null,
                          price numeric(12,2) not null,
                          created_at timestamp not null
);

create table appointments (
                              id uuid primary key,
                              customer_id uuid not null references customers(id),
                              service_id uuid not null references services(id),
                              starts_at timestamp not null,
                              status varchar(30) not null,
                              notes varchar(500),
                              created_at timestamp not null
);

create index idx_appointments_starts_at on appointments(starts_at);
create index idx_appointments_status on appointments(status);
