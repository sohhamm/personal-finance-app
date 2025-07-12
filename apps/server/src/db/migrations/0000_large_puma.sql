CREATE TYPE "public"."category" AS ENUM('Entertainment', 'Bills', 'Groceries', 'Dining Out', 'Transportation', 'Personal Care', 'Education', 'Lifestyle', 'Shopping', 'General');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('income', 'expense');--> statement-breakpoint
CREATE TABLE "budgets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"category" "category" NOT NULL,
	"maximum" numeric(10, 2) NOT NULL,
	"theme" varchar(7) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"target" numeric(10, 2) NOT NULL,
	"total" numeric(10, 2) DEFAULT '0' NOT NULL,
	"theme" varchar(7) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"recipient_sender" varchar(255) NOT NULL,
	"category" "category" NOT NULL,
	"transaction_date" timestamp NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"transaction_type" "transaction_type" NOT NULL,
	"recurring" boolean DEFAULT false NOT NULL,
	"avatar" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pots" ADD CONSTRAINT "pots_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "budget_user_id_idx" ON "budgets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "budget_category_idx" ON "budgets" USING btree ("category");--> statement-breakpoint
CREATE INDEX "unique_user_category_idx" ON "budgets" USING btree ("user_id","category");--> statement-breakpoint
CREATE INDEX "pot_user_id_idx" ON "pots" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "pot_name_idx" ON "pots" USING btree ("name");--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "category_idx" ON "transactions" USING btree ("category");--> statement-breakpoint
CREATE INDEX "transaction_date_idx" ON "transactions" USING btree ("transaction_date");--> statement-breakpoint
CREATE INDEX "transaction_type_idx" ON "transactions" USING btree ("transaction_type");--> statement-breakpoint
CREATE INDEX "recurring_idx" ON "transactions" USING btree ("recurring");--> statement-breakpoint
CREATE INDEX "email_idx" ON "users" USING btree ("email");