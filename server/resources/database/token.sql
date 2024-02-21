USE melee_leaderboard;

DROP TABLE token;

CREATE TABLE token (
    id VARCHAR(255) PRIMARY KEY,
    user VARCHAR(255) DEFAULT 'dev'
);
