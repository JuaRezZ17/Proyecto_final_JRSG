CREATE TABLE "movements" (
	"id"	INTEGER NOT NULL UNIQUE,
	"date"	TEXT NOT NULL,
	"time"	TEXT NOT NULL,
	"moneda_from"	TEXT NOT NULL,
	"cantidad_from"	NUMERIC NOT NULL,
	"moneda_to"	TEXT NOT NULL,
	"cantidad_to"	NUMERIC NOT NULL,
	"user_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "users" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL,
	"surname"	TEXT NOT NULL,
	"address"	TEXT NOT NULL,
	"phone_number"	INTEGER NOT NULL,
	"birthday"	TEXT NOT NULL,
	"email"	TEXT NOT NULL UNIQUE,
	"password"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);