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
    visible integer DEFAULT 0
);

CREATE TABLE tournament (
    tournamentName VARCHAR(255) PRIMARY KEY,
    eventName VARCHAR(255) NOT NULL,
    isWeekly integer DEFAULT 1,
    weight integer DEFAULT 1
);

CREATE TABLE sets (
    id int PRIMARY KEY,
    tournament VARCHAR(255),
    p1 VARCHAR(255),
    p1name VARCHAR(255),
    p2 VARCHAR(255),
    p2name VARCHAR(255),
    winner VARCHAR(255) NOT NULL,
    bracket int,
    round VARCHAR(255),
    completedAt int, 
    eloChange int DEFAULT 0,
    placement int DEFAULT 0,
    FOREIGN KEY (p1) REFERENCES player(id),
    FOREIGN KEY (p2) REFERENCES player(id),
    FOREIGN KEY (tournament) REFERENCES tournament(tournamentName),
    FOREIGN KEY (winner) REFERENCES player(id)
);
