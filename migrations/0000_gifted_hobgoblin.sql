CREATE TABLE IF NOT EXISTS "authentications" (
	"token" varchar PRIMARY KEY NOT NULL,
	"refreshToken" varchar
);
