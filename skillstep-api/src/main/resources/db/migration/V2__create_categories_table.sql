CREATE TABLE categories (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(100)  NOT NULL,
    color      VARCHAR(7)    NOT NULL DEFAULT '#6C63FF',
    user_id    BIGINT        NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Contrainte d'unicité : un nom unique PAR utilisateur
    CONSTRAINT uq_category_name_user UNIQUE (name, user_id),

    -- Clé étrangère vers users
    CONSTRAINT fk_category_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE  -- si l'utilisateur est supprimé, ses catégories aussi
);

CREATE INDEX idx_categories_user_id ON categories(user_id);