CREATE TABLE users (
    email character varying(255) NOT NULL,
    id bigint NOT NULL,
    username character varying(20) NOT NULL,
    fullname character varying(70) NOT NULL,
    password character varying(255),
    balance bigint DEFAULT 0,
    avatar_url text
);