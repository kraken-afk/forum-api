ALTER TABLE "authentications" ALTER COLUMN "refreshToken" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "body" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "threadsId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "ownerId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "threads" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "threads" ALTER COLUMN "body" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "threads" ALTER COLUMN "ownerId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "threads" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "fullname" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "createdAt" SET NOT NULL;