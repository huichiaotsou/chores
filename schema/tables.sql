DROP DATABASE chores;
CREATE DATABASE chores;
USE chores;

CREATE TABLE chores (
    id        INT AUTO_INCREMENT,
    chore     VARCHAR(255),

    UNIQUE (chore),
    PRIMARY KEY (id)
);

CREATE TABLE names (
    id INT AUTO_INCREMENT,
    name VARCHAR(255),

    UNIQUE (name),
    PRIMARY KEY (id)
);

CREATE TABLE records (
    id          INT AUTO_INCREMENT,
    name_id     INT,
    chore_id    INT,
    date        TEXT,
    datetime    DATETIME,

    PRIMARY KEY (id),
    FOREIGN KEY (name_id) REFERENCES names(id),
    FOREIGN KEY (chore_id) REFERENCES chores(id)
);

CREATE TABLE rewards (
    name_id     INT,
    rewards     INT,
    date        TIMESTAMP,

    FOREIGN KEY (name_id) REFERENCES names(id),
    CONSTRAINT person_reward_key UNIQUE (name_id, rewards)
);
