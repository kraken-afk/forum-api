CREATE TABLE IF NOT EXISTS "threads" (
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar,
	"body" text,
	"ownerId" varchar,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "threads" ADD CONSTRAINT "threads_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
