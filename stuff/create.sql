CREATE TABLE users(
    id          INT NOT NULL AUTO_INCREMENT,
    name        CHAR(64) NOT NULL,
    password    CHAR(14),
    admin       BOOL NOT NULL,
    business    BOOL NOT NULL,
    pid         INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (pid) REFERENCES users(id)
);

CREATE INDEX i_users_id ON users (id);
CREATE INDEX i_users_pid ON users (pid);
CREATE INDEX i_users_login ON users (name, password);

INSERT INTO users (id, name, password, admin, business, pid) VALUES(1, 'admin', 'admin', 1, 1, 0);

CREATE TABLE health(
    uid         INT NOT NULL,
    time        BIGINT NOT NULL,
    height      FLOAT NOT NULL,
    weight      FLOAT NOT NULL,
    work        SMALLINT NOT NULL,
    PRIMARY KEY (uid, time),
    FOREIGN KEY (uid) REFERENCES users(id)
);

CREATE INDEX i_health_uid ON health (uid);

CREATE TABLE category(
    id          INT NOT NULL AUTO_INCREMENT,
    name        CHAR(64) NOT NULL,
    pid         INT NOT NULL,
    aid         INT NOT NULL,
    oid         INT NOT NULL,
    mod_servant BOOL NOT NULL,
    mod_others  BOOL NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (pid) REFERENCES category(id),
    FOREIGN KEY (aid) REFERENCES users(id),
    FOREIGN KEY (oid) REFERENCES users(id)
);

CREATE INDEX i_category_id ON category (id);
CREATE INDEX i_category_pid ON category (pid);

INSERT INTO category(id, name, pid, oid, mod_servant, mod_others) VALUES(1, '', 1, 1, 1, 1);

CREATE TABLE product(
    id          INT NOT NULL AUTO_INCREMENT,
    name        CHAR(64) NOT NULL,
    balt        FLOAT NOT NULL,
    rieb        FLOAT NOT NULL,
    angl        FLOAT NOT NULL,
    complex     BOOL NOT NULL,
    secret      BOOL NOT NULL,
    mod_servant BOOL NOT NULL,
    mod_others  BOOL NOT NULL,
    descr       TEXT NOT NULL,
    pid         INT NOT NULL,
    aid         INT NOT NULL,
    oid         INT NOT NULL,
    linkdescr   TEXT NOT NULL,
    link        TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (pid) REFERENCES category(id),
    FOREIGN KEY (aid) REFERENCES users(id),
    FOREIGN KEY (oid) REFERENCES users(id)
);

CREATE INDEX i_product_id ON product(id);
CREATE INDEX i_product_pid ON product(pid);

CREATE TABLE unitname(
    id      INT NOT NULL AUTO_INCREMENT,
    name    CHAR(64) NOT NULL,
    PRIMARY KEY (id)
);

CREATE INDEX i_unitname_id ON unitname(id);

INSERT INTO unitname(id, name) VALUES(1, 'gramai');

CREATE TABLE unit(
    id      INT NOT NULL AUTO_INCREMENT,
    prid    INT NOT NULL,
    unid    INT NOT NULL,
    weight  FLOAT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (prid) REFERENCES product(id),
    FOREIGN KEY (unid) REFERENCES unitname(id)
);

CREATE INDEX i_unit_id ON unit(id);
CREATE INDEX i_unit_prid ON unit(prid);
CREATE INDEX i_unit_unid ON unit(unid);

CREATE TABLE complex(
    prid    INT NOT NULL,
    uid     INT NOT NULL,
    amount  FLOAT NOT NULL,
    FOREIGN KEY (prid) REFERENCES product(id),
    FOREIGN KEY (uid) REFERENCES unit(id)
);

CREATE INDEX i_complex_prid ON complex(prid);
CREATE INDEX i_complex_uid ON complex(uid);

CREATE TABLE menu(
    user    INT NOT NULL,
    uid     INT NOT NULL,
    time    BIGINT NOT NULL,
    amount  FLOAT NOT NULL,
    FOREIGN KEY (user) REFERENCES users(id),
    FOREIGN KEY (uid) REFERENCES unit(id)
);

CREATE INDEX i_menu_eat ON menu(user, time);

alter table users type=innodb;
alter table health type=innodb;
alter table category type=innodb;
alter table product type=innodb;
alter table unitname type=innodb;
alter table unit type=innodb;
alter table complex type=innodb;
alter table menu type=innodb;
