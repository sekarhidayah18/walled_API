CREATE TABLE users (
    email character varying(255) NOT NULL,
    id BIGSERIAL NOT NULL PRIMARY KEY,
    username character varying(20) NOT NULL,
    fullname character varying(70) NOT NULL,
    password text,
    avatar_url text
);

CREATE TABLE wallets (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_number character varying(20) NOT NULL UNIQUE,
    balance numeric(12, 2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    wallet_id BIGINT NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    transaction_type character varying(20) NOT NULL CHECK (transaction_type IN ('top-up', 'transfer')),
    amount numeric(12, 2) NOT NULL CHECK (amount > 0),
    recipient_wallet_id BIGINT REFERENCES wallets(id) ON DELETE SET NULL,
    transaction_date TIMESTAMP DEFAULT NOW(),
    description text
);

CREATE SEQUENCE wallet_number_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE wallets
ADD COLUMN account_number character varying(20) NOT NULL UNIQUE DEFAULT ('12300000' || NEXTVAL('wallet_number_seq'));
