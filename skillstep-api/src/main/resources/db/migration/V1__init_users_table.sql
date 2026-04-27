CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    email           VARCHAR(150)    NOT NULL UNIQUE,
    provider        VARCHAR(50)     NOT NULL,
    provider_id     VARCHAR(150)    NOT NULL UNIQUE,
    headline        VARCHAR(255),
    bio             TEXT,
    target_role     VARCHAR(150),
    linkedin_url    VARCHAR(255),
    github_url      VARCHAR(255),
    avatar_url      VARCHAR(500),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email       ON users(email);
CREATE INDEX idx_users_provider_id ON users(provider_id);