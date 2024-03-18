CREATE TABLE IF NOT EXISTS "users" (
	"address" text PRIMARY KEY NOT NULL,
	"email" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wallets" (
	"id" serial PRIMARY KEY NOT NULL,
	"owners" text[] NOT NULL,
	"threshold" integer NOT NULL,
	"chain" integer NOT NULL,
	"address" text NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_idx" ON "users" ("email");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wallets" ADD CONSTRAINT "wallets_address_users_address_fk" FOREIGN KEY ("address") REFERENCES "users"("address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
