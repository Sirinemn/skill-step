CREATE TABLE learning_logs (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    duration_min INT          NOT NULL CHECK (duration_min > 0),
    log_date    DATE         NOT NULL,
    resource_url VARCHAR(500),
    user_id     BIGINT       NOT NULL,
    category_id BIGINT,      -- nullable : catégorie optionnelle

    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_log_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_log_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL  -- si catégorie supprimée (normalement bloqué), log reste
);

CREATE INDEX idx_learning_logs_user_id    ON learning_logs(user_id);
CREATE INDEX idx_learning_logs_category_id ON learning_logs(category_id);
CREATE INDEX idx_learning_logs_log_date   ON learning_logs(user_id, log_date DESC);