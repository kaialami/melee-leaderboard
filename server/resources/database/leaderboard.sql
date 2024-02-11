USE melee_leaderboard;

DROP TABLE sets;
DROP TABLE player;
DROP TABLE tournament;

CREATE TABLE player (
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    ranking integer,
    elo integer DEFAULT 1000,
    wins integer DEFAULT 0,
    played integer DEFAULT 0,
    visible integer DEFAULT 1
);

CREATE TABLE tournament (
    tournamentName VARCHAR(255) PRIMARY KEY,
    eventName VARCHAR(255) NOT NULL
);

CREATE TABLE sets (
    p1 VARCHAR(255),
    p2 VARCHAR(255),
    tournament VARCHAR(255),
    bracket int,
    winner int NOT NULL,
    PRIMARY KEY (p1, p2, tournament, bracket),
    FOREIGN KEY (p1) REFERENCES player(id),
    FOREIGN KEY (p2) REFERENCES player(id),
    FOREIGN KEY (tournament) REFERENCES tournament(tournamentName)
);


INSERT INTO player(id, username)
VALUES('19c63f43', 'kai');
