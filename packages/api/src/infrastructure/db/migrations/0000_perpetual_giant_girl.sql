CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "users" USING btree ("email");