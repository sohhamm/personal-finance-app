CREATE TABLE "recurring_bills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"due_day" integer NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
	"category" "category" NOT NULL,
	"avatar" varchar(500),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint

CREATE TABLE "recurring_bill_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recurring_bill_id" uuid NOT NULL,
	"transaction_id" uuid,
	"due_date" date NOT NULL,
	"paid_date" timestamp,
	"amount" numeric(10, 2) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'paid', 'overdue')),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint

ALTER TABLE "recurring_bills" ADD CONSTRAINT "recurring_bills_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_bill_payments" ADD CONSTRAINT "recurring_bill_payments_recurring_bill_id_recurring_bills_id_fk" FOREIGN KEY ("recurring_bill_id") REFERENCES "public"."recurring_bills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_bill_payments" ADD CONSTRAINT "recurring_bill_payments_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint

CREATE INDEX "recurring_bills_user_id_idx" ON "recurring_bills" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "recurring_bills_name_idx" ON "recurring_bills" USING btree ("name");--> statement-breakpoint
CREATE INDEX "recurring_bills_due_day_idx" ON "recurring_bills" USING btree ("due_day");--> statement-breakpoint
CREATE INDEX "recurring_bill_payments_bill_id_idx" ON "recurring_bill_payments" USING btree ("recurring_bill_id");--> statement-breakpoint
CREATE INDEX "recurring_bill_payments_due_date_idx" ON "recurring_bill_payments" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "recurring_bill_payments_status_idx" ON "recurring_bill_payments" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_bill_due_date_idx" ON "recurring_bill_payments" USING btree ("recurring_bill_id", "due_date");