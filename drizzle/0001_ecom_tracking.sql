-- E-Commerce Tracking System migration
-- Renames stripe_payment_intent_id → payment_transaction_id (generic for any processor)
-- Adds: orderNumber, customerPhone, customerAddress, upsellHistory, liveMode, source
-- Makes funnelId nullable (standalone orders without funnel reference)

ALTER TABLE "purchases" ALTER COLUMN "funnel_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "purchases" RENAME COLUMN "stripe_payment_intent_id" TO "payment_transaction_id";--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "order_number" integer;--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "customer_phone" text;--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "customer_address" jsonb;--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "upsell_history" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "source" text DEFAULT 'funnel-checkout';--> statement-breakpoint
ALTER TABLE "purchases" ADD COLUMN "live_mode" boolean DEFAULT false;--> statement-breakpoint
CREATE INDEX "purchase_status_idx" ON "purchases" USING btree ("status");--> statement-breakpoint
CREATE INDEX "purchase_created_idx" ON "purchases" USING btree ("created_at");--> statement-breakpoint
DROP INDEX IF EXISTS "purchase_stripe_idx";--> statement-breakpoint
CREATE INDEX "purchase_payment_idx" ON "purchases" USING btree ("payment_transaction_id");--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_order_number_unique" UNIQUE("order_number");
