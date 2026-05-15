CREATE TYPE "public"."ab_test_status" AS ENUM('draft', 'running', 'paused', 'completed');--> statement-breakpoint
CREATE TYPE "public"."ad_fate" AS ENUM('winner', 'almost', 'loser', 'pending');--> statement-breakpoint
CREATE TYPE "public"."ads_funnel_stage" AS ENUM('tofu', 'mofu', 'bofu', 'retention', 'reactivation');--> statement-breakpoint
CREATE TYPE "public"."alert_severity" AS ENUM('info', 'warning', 'critical');--> statement-breakpoint
CREATE TYPE "public"."campaign_phase" AS ENUM('phase1_validation', 'phase2_scaling');--> statement-breakpoint
CREATE TYPE "public"."campaign_type" AS ENUM('testing', 'cbo_scaling', 'zombie_cost_cap');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('PageView', 'ViewContent', 'AddToCart', 'InitiateCheckout', 'Purchase', 'click', 'scroll', 'form_submit');--> statement-breakpoint
CREATE TYPE "public"."funnel_status" AS ENUM('draft', 'active', 'paused', 'archived');--> statement-breakpoint
CREATE TYPE "public"."step_type" AS ENUM('optin', 'checkout', 'thank-you', 'upsell', 'downsell', 'advertorial', 'vsl', 'quiz', 'product-page', 'bridge');--> statement-breakpoint
CREATE TYPE "public"."test_phase" AS ENUM('sandbox', 'elimination', 'commando', 'duel', 'champion');--> statement-breakpoint
CREATE TABLE "ab_tests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"step_id" uuid NOT NULL,
	"hypothesis_id" uuid,
	"phase" "test_phase" DEFAULT 'sandbox',
	"status" "ab_test_status" DEFAULT 'draft',
	"primary_metric" text DEFAULT 'aov_cvr',
	"thresholds" jsonb NOT NULL,
	"min_sample_size" integer DEFAULT 500,
	"confidence_threshold" numeric(4, 3) DEFAULT '0.950',
	"auto_promote" boolean DEFAULT true,
	"winner_variant_id" uuid,
	"started_at" timestamp,
	"ended_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ad_alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"severity" "alert_severity" DEFAULT 'info',
	"campaign_id" uuid,
	"ad_id" uuid,
	"message" text NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb,
	"acknowledged_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ad_campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "campaign_type" NOT NULL,
	"phase" "campaign_phase" DEFAULT 'phase1_validation',
	"name" text NOT NULL,
	"ad_account_id" uuid NOT NULL,
	"funnel_id" uuid,
	"angle_id" uuid NOT NULL,
	"budget_daily" integer NOT NULL,
	"target_cpa" integer,
	"currency" text DEFAULT 'USD',
	"test_country" text,
	"status" text DEFAULT 'draft',
	"minimum_run_days" integer DEFAULT 3,
	"meta_campaign_id" text,
	"started_at" timestamp,
	"ended_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ad_metrics_daily" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ad_id" uuid NOT NULL,
	"campaign_id" uuid NOT NULL,
	"date" timestamp NOT NULL,
	"spend" integer DEFAULT 0,
	"impressions" integer DEFAULT 0,
	"clicks" integer DEFAULT 0,
	"cpc" numeric(10, 4) DEFAULT '0',
	"cpm" numeric(10, 4) DEFAULT '0',
	"ctr" numeric(6, 4) DEFAULT '0',
	"landing_page_views" integer DEFAULT 0,
	"add_to_carts" integer DEFAULT 0,
	"initiate_checkouts" integer DEFAULT 0,
	"purchases" integer DEFAULT 0,
	"purchase_value" integer DEFAULT 0,
	"cvr" numeric(6, 4) DEFAULT '0',
	"aov" numeric(12, 2) DEFAULT '0',
	"aov_times_cvr" numeric(10, 4) DEFAULT '0',
	"cpa" numeric(12, 2) DEFAULT '0',
	"roas" numeric(8, 4) DEFAULT '0',
	"atc_to_purchase_ratio" numeric(6, 2) DEFAULT '0',
	"video_views_25" integer DEFAULT 0,
	"video_views_50" integer DEFAULT 0,
	"video_views_75" integer DEFAULT 0,
	"video_views_100" integer DEFAULT 0,
	"cpmr" numeric(10, 4) DEFAULT '0',
	"incremental_reach_pct" numeric(6, 4) DEFAULT '0',
	"incremental_conversions" integer DEFAULT 0,
	"incremental_roas" numeric(8, 4) DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "ad_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"name" text NOT NULL,
	"targeting" jsonb NOT NULL,
	"landing_page_slug" text NOT NULL,
	"landing_page_url" text NOT NULL,
	"budget_daily" integer,
	"cost_cap" integer,
	"status" text DEFAULT 'active',
	"meta_ad_set_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ad_set_id" uuid NOT NULL,
	"name" text NOT NULL,
	"format" text NOT NULL,
	"creative_type" text NOT NULL,
	"funnel_stage" "ads_funnel_stage" DEFAULT 'tofu',
	"headline" text NOT NULL,
	"primary_text" text NOT NULL,
	"description" text,
	"cta_text" text NOT NULL,
	"call_to_action" text DEFAULT 'LEARN_MORE',
	"image_url" text,
	"video_url" text,
	"thumbnail_url" text,
	"url_tags" text,
	"entity_id" text,
	"entity_slot" text,
	"creator_profile_id" uuid,
	"is_whitelisted" boolean DEFAULT false,
	"posting_as_page" text,
	"status" text DEFAULT 'draft',
	"fate" "ad_fate" DEFAULT 'pending',
	"fate_reason" text,
	"meta_ad_id" text,
	"meta_creative_id" text,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ads_extensions" (
	"ad_id" text PRIMARY KEY NOT NULL,
	"funnel_stage" text DEFAULT 'tofu',
	"force_spend_percent" integer,
	"placement_exclusions" jsonb DEFAULT '["audience_network"]'::jsonb
);
--> statement-breakpoint
CREATE TABLE "agent_costs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"agent_id" text NOT NULL,
	"action" text NOT NULL,
	"cost_cents" integer DEFAULT 0,
	"revenue_cents" integer DEFAULT 0,
	"roi" numeric(10, 2) DEFAULT '0',
	"ts" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ai_consensus_votes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"niche_id" uuid NOT NULL,
	"model_name" text NOT NULL,
	"total_score" numeric(4, 2),
	"raw_response" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "angle_research" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"niche_id" uuid NOT NULL,
	"name" text NOT NULL,
	"pain_point" text NOT NULL,
	"desire" text NOT NULL,
	"promise" text NOT NULL,
	"avatar" jsonb NOT NULL,
	"emotion" text NOT NULL,
	"awareness_level" text NOT NULL,
	"funnel_stage" "ads_funnel_stage" DEFAULT 'tofu',
	"landing_page_slug" text,
	"cpc" numeric(10, 4),
	"ctr" numeric(6, 4),
	"status" text DEFAULT 'research',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attributions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"purchase_id" uuid NOT NULL,
	"model" text NOT NULL,
	"total_revenue" numeric(12, 2),
	"roas_breakdown" jsonb,
	"calculated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "block_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"description" text,
	"html_template" text NOT NULL,
	"css_template" text DEFAULT '',
	"js_template" text DEFAULT '',
	"config_schema" jsonb NOT NULL,
	"default_config" jsonb NOT NULL,
	"is_system" boolean DEFAULT false,
	"created_by_agent" boolean DEFAULT false,
	"usage_count" integer DEFAULT 0,
	"performance_score" numeric(4, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "block_definitions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "block_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"block_id" text NOT NULL,
	"variant_id" uuid,
	"event_type" text NOT NULL,
	"count" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "budget_allocations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"funnel_id" uuid,
	"total_daily_budget" integer NOT NULL,
	"testing_budget" integer NOT NULL,
	"scaling_budget" integer NOT NULL,
	"cbo_budget" integer NOT NULL,
	"zombie_budget" integer NOT NULL,
	"testing_creative_budget" integer NOT NULL,
	"testing_lp_budget" integer NOT NULL,
	"daily_creatives_needed" integer DEFAULT 0,
	"video_editors_needed" integer DEFAULT 1,
	"copywriters_needed" integer DEFAULT 1,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bundles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"funnel_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"products" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"compare_at_price" numeric(12, 2),
	"is_popular" boolean DEFAULT false,
	"is_optimal" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "change_proposals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"debate_id" uuid,
	"type" text NOT NULL,
	"diff_content" text,
	"status" text DEFAULT 'pending_review',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "conversions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_id" uuid NOT NULL,
	"experiment_id" uuid NOT NULL,
	"visitor_id" text NOT NULL,
	"event_type" text NOT NULL,
	"revenue" numeric(12, 2),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "country_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"country_code" text NOT NULL,
	"country_name" text NOT NULL,
	"language" text NOT NULL,
	"currency" text NOT NULL,
	"currency_symbol" text NOT NULL,
	"required_processors" jsonb DEFAULT '[]'::jsonb,
	"recommended_processors" jsonb DEFAULT '[]'::jsonb,
	"translation_method" text DEFAULT 'same_english',
	"ads_language" text DEFAULT 'en',
	"site_language" text DEFAULT 'en',
	"test_with_english_first" boolean DEFAULT true,
	"english_proficiency" text DEFAULT 'medium',
	"estimated_cpc_range" jsonb,
	"recommended_platforms" jsonb DEFAULT '[]'::jsonb,
	"population" integer,
	"avg_order_value" numeric(8, 2),
	"expansion_phase" integer DEFAULT 1,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "country_configs_country_code_unique" UNIQUE("country_code")
);
--> statement-breakpoint
CREATE TABLE "creative_fatigue_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ad_id" text NOT NULL,
	"date" timestamp NOT NULL,
	"frequency" numeric(6, 2),
	"ctr_trend_7d" numeric(6, 4),
	"roas_trend_7d" numeric(6, 4),
	"fatigue_score" integer,
	"recommendation" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "creative_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"format" text NOT NULL,
	"funnel_stage" "ads_funnel_stage" NOT NULL,
	"hook_structures" jsonb DEFAULT '[]'::jsonb,
	"body_structures" jsonb DEFAULT '[]'::jsonb,
	"cta_variants" jsonb DEFAULT '[]'::jsonb,
	"visual_guidance" text,
	"emotion_guide" text,
	"meta_compliance" text,
	"placeholder_keys" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "creator_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"meta_page_id" text,
	"meta_handle" text,
	"ad_account_id" text,
	"is_whitelisted" boolean DEFAULT false,
	"whitelisted_at" timestamp,
	"niche_category" text,
	"follower_count" integer,
	"avg_engagement_rate" numeric(4, 2),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "discovered_niches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"volume_score" numeric(4, 2),
	"intensity_score" numeric(4, 2),
	"gap_score" numeric(4, 2),
	"trend_score" numeric(4, 2),
	"accessibility_score" numeric(4, 2),
	"total_score" numeric(4, 2),
	"demand_volume" integer,
	"estimated_cpc" numeric(5, 2),
	"status" text DEFAULT 'researching',
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "discovered_niches_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "element_revenue" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_id" uuid NOT NULL,
	"bid" text NOT NULL,
	"clicks" integer DEFAULT 0,
	"revenue" numeric(12, 2) DEFAULT '0',
	"rect" jsonb,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_type" "event_type" NOT NULL,
	"event_id" text NOT NULL,
	"variant_id" uuid,
	"funnel_id" uuid,
	"session_id" text,
	"visitor_id" text,
	"block_id" text,
	"element_tag" text,
	"value" numeric(10, 2),
	"currency" text DEFAULT 'USD',
	"payload" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evolution_debates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"insight_id" uuid,
	"topic" text NOT NULL,
	"arguments_for" jsonb,
	"arguments_against" jsonb,
	"decision" text DEFAULT 'research',
	"confidence" numeric(4, 2),
	"concluded_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "experiment_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"experiment_id" uuid NOT NULL,
	"name" text NOT NULL,
	"block_tree" jsonb NOT NULL,
	"design_tokens" jsonb,
	"rendered_html" text,
	"traffic_weight" real DEFAULT 0.5,
	"is_control" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "experiments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"funnel_page_id" uuid NOT NULL,
	"name" text NOT NULL,
	"stage" text DEFAULT 'sandbox',
	"hypothesis" text,
	"primary_metric" text DEFAULT 'conversion_rate',
	"traffic_allocation" real DEFAULT 1,
	"min_sample_size" integer DEFAULT 1000,
	"confidence_level" real DEFAULT 0.95,
	"started_at" timestamp,
	"ended_at" timestamp,
	"result" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fb_accounts_warmup" (
	"account_id" text PRIMARY KEY NOT NULL,
	"warmup_stage" integer DEFAULT 0,
	"daily_spend_cap" integer DEFAULT 50,
	"trust_score" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "funnel_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"funnel_id" uuid NOT NULL,
	"type" "step_type" NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"sort_order" integer NOT NULL,
	"active_variant_id" uuid,
	"next_step_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "funnels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"domain" text,
	"subdomain" text,
	"status" "funnel_status" DEFAULT 'draft',
	"product_id" uuid,
	"research_mode" boolean DEFAULT false,
	"research_phase" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "funnels_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "growth_cycles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"funnel_id" uuid NOT NULL,
	"step_id" uuid,
	"cycle_number" integer NOT NULL,
	"status" text DEFAULT 'proposing',
	"hypothesis_id" uuid,
	"previous_score" numeric(10, 2),
	"current_score" numeric(10, 2),
	"improvement" numeric(6, 2),
	"agent_decision" jsonb,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "hypotheses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"funnel_id" uuid NOT NULL,
	"step_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"target_variable" text NOT NULL,
	"variable_category" text NOT NULL,
	"above_fold" boolean DEFAULT true,
	"impact" integer NOT NULL,
	"confidence" integer NOT NULL,
	"ease" integer DEFAULT 8,
	"status" text DEFAULT 'draft',
	"test_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "judge_decision_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"test_id" uuid,
	"dimension_slug" text NOT NULL,
	"funnel_id" uuid,
	"decision" text NOT NULL,
	"winner_id" text,
	"reasoning" text NOT NULL,
	"confidence" numeric(4, 3),
	"next_steps" jsonb,
	"metrics_snapshot" jsonb,
	"decided_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"type" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"last_checked_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "marketing_angles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"funnel_id" uuid NOT NULL,
	"name" text NOT NULL,
	"headline" text NOT NULL,
	"subheadline" text,
	"pain_point" text,
	"solution" text,
	"cta_text" text,
	"benefits" jsonb DEFAULT '[]'::jsonb,
	"guarantee" text,
	"extras" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marketing_angles_research" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"niche_id" uuid NOT NULL,
	"pain_point" text NOT NULL,
	"desire" text NOT NULL,
	"avatar" text NOT NULL,
	"emotion" text NOT NULL,
	"promise" text NOT NULL,
	"hooks" jsonb,
	"confidence_score" numeric(4, 2),
	"status" text DEFAULT 'generated',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meta_ad_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"funnel_id" uuid,
	"meta_ad_account_id" text NOT NULL,
	"access_token" text NOT NULL,
	"pixel_id" text NOT NULL,
	"business_id" text,
	"app_secret" text,
	"tracking_domain" text,
	"currency" text DEFAULT 'USD',
	"is_fresh" boolean DEFAULT true,
	"is_active" boolean DEFAULT true,
	"signal_quality_score" numeric(4, 2) DEFAULT '0',
	"event_match_quality" numeric(4, 2) DEFAULT '0',
	"last_signal_check_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "metrics_5min" (
	"variant_id" uuid NOT NULL,
	"bucket" timestamp NOT NULL,
	"views" integer DEFAULT 0,
	"clicks" integer DEFAULT 0,
	"atc" integer DEFAULT 0,
	"purchases" integer DEFAULT 0,
	"revenue" numeric(12, 2) DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "metrics_daily" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_id" uuid NOT NULL,
	"funnel_id" uuid NOT NULL,
	"date" timestamp NOT NULL,
	"visitors" integer DEFAULT 0,
	"page_views" integer DEFAULT 0,
	"clicks" integer DEFAULT 0,
	"add_to_carts" integer DEFAULT 0,
	"purchases" integer DEFAULT 0,
	"revenue" numeric(12, 2) DEFAULT '0',
	"new_customer_spend" integer DEFAULT 0,
	"existing_customer_spend" integer DEFAULT 0,
	"engaged_audience_spend" integer DEFAULT 0,
	"cvr" numeric(6, 4) DEFAULT '0',
	"aov" numeric(12, 2) DEFAULT '0',
	"aov_times_cvr" numeric(10, 4) DEFAULT '0',
	"cart_to_purchase_ratio" numeric(6, 2) DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "metrics_hourly" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_id" uuid NOT NULL,
	"hour" timestamp NOT NULL,
	"visitors" integer DEFAULT 0,
	"page_views" integer DEFAULT 0,
	"clicks" integer DEFAULT 0,
	"add_to_carts" integer DEFAULT 0,
	"checkout_starts" integer DEFAULT 0,
	"purchases" integer DEFAULT 0,
	"revenue" numeric(12, 2) DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "niche_research" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"trends_data" jsonb,
	"pain_points" jsonb DEFAULT '[]'::jsonb,
	"desire_statements" jsonb DEFAULT '[]'::jsonb,
	"competitor_ads" jsonb,
	"difficulty" integer DEFAULT 5,
	"opportunity_score" numeric(6, 2) DEFAULT '0',
	"status" text DEFAULT 'research',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offer_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"source" text,
	"estimated_cvr" text,
	"best_for_niches" jsonb DEFAULT '[]'::jsonb,
	"funnel_flow" jsonb DEFAULT '[]'::jsonb,
	"config" jsonb NOT NULL,
	"headlines" jsonb DEFAULT '[]'::jsonb,
	"cta_texts" jsonb DEFAULT '[]'::jsonb,
	"why_free_texts" jsonb DEFAULT '[]'::jsonb,
	"guarantee_texts" jsonb DEFAULT '[]'::jsonb,
	"cancel_warning_texts" jsonb DEFAULT '[]'::jsonb,
	"is_proven" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"funnel_id" uuid,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"regular_price" numeric(12, 2) NOT NULL,
	"trial_price" numeric(12, 2) DEFAULT '0',
	"shipping_price" numeric(12, 2) DEFAULT '4.90',
	"subscription_price" numeric(12, 2),
	"subscription_interval" text DEFAULT 'month',
	"subscription_benefits" jsonb DEFAULT '{"lifetimeDiscount":50,"freeShipping":true,"cancelAnytime":true,"freeGifts":[]}'::jsonb,
	"shipping_explanation" text,
	"trial_duration_days" integer DEFAULT 30,
	"auto_charge_after_trial" boolean DEFAULT true,
	"cancel_warning_email" text,
	"cancel_warning_page" text,
	"limited_spots" integer,
	"countdown_minutes" integer,
	"promo_code" text,
	"trial_headline" text,
	"why_free_explanation" text,
	"guarantee_text" text,
	"stripe_trial_price_id" text,
	"stripe_subscription_price_id" text,
	"max_traffic_percent" integer DEFAULT 100,
	"daily_budget_cap" numeric(10, 2),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"step_id" uuid NOT NULL,
	"name" text NOT NULL,
	"angle" text,
	"hypothesis" text,
	"status" text DEFAULT 'draft',
	"traffic_weight" integer DEFAULT 50,
	"is_control" boolean DEFAULT false,
	"is_winner" boolean DEFAULT false,
	"page" jsonb NOT NULL,
	"changed_blocks" jsonb DEFAULT '[]'::jsonb,
	"test_variable" jsonb,
	"r2_key" text,
	"deployed_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pixel_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"funnel_id" uuid NOT NULL,
	"pixel_id" text NOT NULL,
	"access_token" text NOT NULL,
	"test_event_code" text,
	"ga4_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "placement_tests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"test_type" text NOT NULL,
	"variant_a" jsonb NOT NULL,
	"variant_b" jsonb NOT NULL,
	"status" text DEFAULT 'draft',
	"winner_variant" text,
	"metrics_a" jsonb,
	"metrics_b" jsonb,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"images" jsonb DEFAULT '[]'::jsonb,
	"price" numeric(12, 2) NOT NULL,
	"compare_at_price" numeric(12, 2),
	"currency" text DEFAULT 'USD',
	"stripe_product_id" text,
	"stripe_price_id" text,
	"is_active" boolean DEFAULT true,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "promo_auto_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"funnel_id" uuid NOT NULL,
	"promo_code" text NOT NULL,
	"trigger_type" text NOT NULL,
	"trigger_value" text NOT NULL,
	"discount_percent" integer NOT NULL,
	"max_uses" integer,
	"used_count" integer DEFAULT 0,
	"expires_at" timestamp,
	"banner_text" text,
	"banner_style" text DEFAULT 'banner_top',
	"auto_apply" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"funnel_id" uuid,
	"variant_id" uuid,
	"order_number" integer,
	"session_id" text NOT NULL,
	"customer_email" text NOT NULL,
	"customer_name" text,
	"customer_phone" text,
	"customer_address" jsonb,
	"items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"upsell_history" jsonb DEFAULT '[]'::jsonb,
	"subtotal" numeric(12, 2) NOT NULL,
	"shipping" numeric(12, 2) DEFAULT '0',
	"tax" numeric(12, 2) DEFAULT '0',
	"total" numeric(12, 2) NOT NULL,
	"currency" text DEFAULT 'USD',
	"payment_transaction_id" text,
	"status" text DEFAULT 'pending',
	"live_mode" boolean DEFAULT false,
	"source" text DEFAULT 'funnel-checkout',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "purchases_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "rag_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_type" text NOT NULL,
	"content" text NOT NULL,
	"metadata" jsonb,
	"embedding" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "raw_events" (
	"event_id" text PRIMARY KEY NOT NULL,
	"event_type" text NOT NULL,
	"session_id" text NOT NULL,
	"payload" jsonb NOT NULL,
	"received_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "raw_insights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" uuid,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"content_hash" text NOT NULL,
	"relevance_score" numeric(4, 2),
	"status" text DEFAULT 'new',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "research_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"niche_id" uuid NOT NULL,
	"type" text,
	"url" text,
	"content" text,
	"sentiment" numeric(4, 2),
	"extracted_keywords" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "retention_triggers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"name" text NOT NULL,
	"trigger_type" text NOT NULL,
	"days_offset" integer NOT NULL,
	"email_subject" text NOT NULL,
	"email_body" text NOT NULL,
	"cta_text" text,
	"cta_url" text,
	"incentive_type" text,
	"incentive_value" text,
	"skip_if_still_active" boolean DEFAULT true,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription_milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"month" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" text NOT NULL,
	"value_usd" numeric(8, 2),
	"retain_after_months" integer,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "survey_insights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shop_id" uuid NOT NULL,
	"category" text NOT NULL,
	"keyword" text NOT NULL,
	"frequency" integer DEFAULT 1,
	"sentiment_avg" numeric(4, 2),
	"last_updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "survey_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"survey_id" uuid NOT NULL,
	"customer_hash" text NOT NULL,
	"answers" jsonb NOT NULL,
	"sentiment_score" numeric(4, 2),
	"keywords" jsonb,
	"completed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "surveys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shop_id" uuid NOT NULL,
	"name" text NOT NULL,
	"trigger" text NOT NULL,
	"questions" jsonb NOT NULL,
	"reward" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"structure" jsonb NOT NULL,
	"is_built_in" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "templates_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "test_dimensions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"description" text,
	"possible_values" jsonb DEFAULT '[]'::jsonb,
	"primary_metric" text NOT NULL,
	"secondary_metrics" jsonb DEFAULT '[]'::jsonb,
	"min_sample_size" integer DEFAULT 100,
	"estimated_duration" text,
	"priority" integer DEFAULT 50,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "test_dimensions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "test_knowledge" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dimension_slug" text NOT NULL,
	"pattern" text NOT NULL,
	"confidence" numeric(4, 3),
	"sample_tests" integer DEFAULT 1,
	"applicability" text DEFAULT 'universal',
	"niche_category" text,
	"source" text DEFAULT 'auto_discovered',
	"is_active" boolean DEFAULT true,
	"discovered_at" timestamp DEFAULT now() NOT NULL,
	"last_confirmed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "test_learnings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hypothesis_id" uuid NOT NULL,
	"funnel_id" uuid NOT NULL,
	"variable_fingerprint" text NOT NULL,
	"winner_variant_id" uuid,
	"metric_before" numeric(10, 4),
	"metric_after" numeric(10, 4),
	"improvement" numeric(6, 2),
	"sample_size" integer,
	"confidence" numeric(4, 3),
	"transferable" boolean DEFAULT false,
	"transferred_from" uuid,
	"confidence_boost" numeric(4, 3),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_queue" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"test_id" uuid NOT NULL,
	"variant_id" uuid NOT NULL,
	"priority" integer DEFAULT 0,
	"status" text DEFAULT 'queued',
	"enqueued_at" timestamp DEFAULT now() NOT NULL,
	"activated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "test_variant_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_id" uuid NOT NULL,
	"test_id" uuid NOT NULL,
	"visitors" integer DEFAULT 0,
	"clicks" integer DEFAULT 0,
	"add_to_carts" integer DEFAULT 0,
	"checkout_starts" integer DEFAULT 0,
	"purchases" integer DEFAULT 0,
	"revenue" numeric(12, 2) DEFAULT '0',
	"cvr" numeric(6, 4) DEFAULT '0',
	"aov" numeric(12, 2) DEFAULT '0',
	"aov_times_cvr" numeric(10, 4) DEFAULT '0',
	"cart_to_purchase_ratio" numeric(6, 2) DEFAULT '0',
	"cvr_lower" numeric(6, 4),
	"cvr_upper" numeric(6, 4),
	"is_sandbox" boolean DEFAULT false,
	"sandbox_visits" integer DEFAULT 0,
	"sandbox_passed" boolean DEFAULT false,
	"eliminated_at" timestamp,
	"eliminated_reason" text,
	"promoted_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "touchpoints" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"user_hash" text NOT NULL,
	"channel" text NOT NULL,
	"campaign_id" text,
	"ad_id" text,
	"timestamp" bigint NOT NULL,
	"cost" numeric(12, 2)
);
--> statement-breakpoint
CREATE TABLE "universal_test_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"test_id" uuid NOT NULL,
	"variant_id" text NOT NULL,
	"impressions" integer DEFAULT 0,
	"clicks" integer DEFAULT 0,
	"conversions" integer DEFAULT 0,
	"revenue" numeric(12, 2) DEFAULT '0',
	"spend" numeric(12, 2) DEFAULT '0',
	"ctr" numeric(6, 4),
	"cvr" numeric(6, 4),
	"cpa" numeric(12, 2),
	"roas" numeric(8, 4),
	"aov" numeric(12, 2),
	"primary_metric_value" numeric(12, 4),
	"confidence_lower" numeric(6, 4),
	"confidence_upper" numeric(6, 4),
	"sample_size" integer DEFAULT 0,
	"period_start" timestamp,
	"period_end" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "universal_tests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dimension_id" uuid NOT NULL,
	"funnel_id" uuid,
	"name" text NOT NULL,
	"hypothesis" text,
	"proposed_by" text DEFAULT 'ai_judge',
	"variants" jsonb NOT NULL,
	"status" text DEFAULT 'proposed',
	"traffic_split" text DEFAULT 'equal',
	"started_at" timestamp,
	"ended_at" timestamp,
	"winner_variant_id" text,
	"confidence" numeric(4, 3),
	"is_significant" boolean DEFAULT false,
	"judge_decision" jsonb,
	"target_scope" text,
	"target_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "upsell_offers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"funnel_id" uuid NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"trigger" text NOT NULL,
	"product_id" uuid NOT NULL,
	"main_product_id" uuid NOT NULL,
	"regular_price" numeric(12, 2) NOT NULL,
	"upsell_price" numeric(12, 2) NOT NULL,
	"discount_percent" integer DEFAULT 30,
	"headline" text NOT NULL,
	"subheadline" text,
	"cta_text" text NOT NULL,
	"urgency_note" text,
	"no_thanks_text" text DEFAULT 'No thanks, I''ll pass',
	"vsl_enabled" boolean DEFAULT false,
	"vsl_video_url" text,
	"vsl_autoplay" boolean DEFAULT true,
	"vsl_poster_image" text,
	"one_click" boolean DEFAULT true,
	"show_no_thanks" boolean DEFAULT true,
	"no_thanks_behavior" text DEFAULT 'downsell',
	"downsell_id" uuid,
	"impressions" integer DEFAULT 0,
	"conversions" integer DEFAULT 0,
	"revenue" numeric(12, 2) DEFAULT '0',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"image_url" text,
	"role" text DEFAULT 'user' NOT NULL,
	"plan" text DEFAULT 'free' NOT NULL,
	"stripe_customer_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "winning_patterns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pattern_type" text NOT NULL,
	"page_type" text NOT NULL,
	"vertical" text,
	"description" text NOT NULL,
	"block_signature" jsonb,
	"lift_percent" real,
	"confidence" real,
	"sample_size" integer,
	"experiment_ids" jsonb,
	"embedding" text,
	"status" text DEFAULT 'candidate',
	"codified_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "alerts_severity_idx" ON "ad_alerts" USING btree ("severity","acknowledged_at");--> statement-breakpoint
CREATE INDEX "campaigns_account_idx" ON "ad_campaigns" USING btree ("ad_account_id");--> statement-breakpoint
CREATE INDEX "campaigns_angle_idx" ON "ad_campaigns" USING btree ("angle_id");--> statement-breakpoint
CREATE INDEX "campaigns_type_status" ON "ad_campaigns" USING btree ("type","status");--> statement-breakpoint
CREATE UNIQUE INDEX "metrics_ad_date" ON "ad_metrics_daily" USING btree ("ad_id","date");--> statement-breakpoint
CREATE INDEX "metrics_campaign_date" ON "ad_metrics_daily" USING btree ("campaign_id","date");--> statement-breakpoint
CREATE INDEX "metrics_date" ON "ad_metrics_daily" USING btree ("date");--> statement-breakpoint
CREATE INDEX "adsets_campaign_idx" ON "ad_sets" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "ads_adset_idx" ON "ads" USING btree ("ad_set_id");--> statement-breakpoint
CREATE INDEX "ads_fate_idx" ON "ads" USING btree ("fate","status");--> statement-breakpoint
CREATE INDEX "ads_entity_idx" ON "ads" USING btree ("entity_id");--> statement-breakpoint
CREATE INDEX "consensus_niche_idx" ON "ai_consensus_votes" USING btree ("niche_id");--> statement-breakpoint
CREATE INDEX "angle_niche_idx" ON "angle_research" USING btree ("niche_id");--> statement-breakpoint
CREATE INDEX "block_events_idx" ON "block_events" USING btree ("block_id","variant_id","event_type");--> statement-breakpoint
CREATE INDEX "budget_funnel_idx" ON "budget_allocations" USING btree ("funnel_id");--> statement-breakpoint
CREATE INDEX "bundle_funnel_idx" ON "bundles" USING btree ("funnel_id");--> statement-breakpoint
CREATE INDEX "proposals_debate_idx" ON "change_proposals" USING btree ("debate_id");--> statement-breakpoint
CREATE INDEX "conv_variant_idx" ON "conversions" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "conv_exp_type_idx" ON "conversions" USING btree ("experiment_id","event_type");--> statement-breakpoint
CREATE INDEX "conv_time_idx" ON "conversions" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_elem_rev" ON "element_revenue" USING btree ("variant_id","bid");--> statement-breakpoint
CREATE INDEX "events_variant_time" ON "events" USING btree ("variant_id","created_at");--> statement-breakpoint
CREATE INDEX "events_type_time" ON "events" USING btree ("event_type","created_at");--> statement-breakpoint
CREATE INDEX "events_funnel_time" ON "events" USING btree ("funnel_id","created_at");--> statement-breakpoint
CREATE INDEX "debates_insight_idx" ON "evolution_debates" USING btree ("insight_id");--> statement-breakpoint
CREATE INDEX "variant_exp_idx" ON "experiment_variants" USING btree ("experiment_id");--> statement-breakpoint
CREATE INDEX "exp_page_idx" ON "experiments" USING btree ("funnel_page_id");--> statement-breakpoint
CREATE INDEX "steps_funnel_idx" ON "funnel_steps" USING btree ("funnel_id");--> statement-breakpoint
CREATE UNIQUE INDEX "steps_funnel_slug" ON "funnel_steps" USING btree ("funnel_id","slug");--> statement-breakpoint
CREATE INDEX "funnel_product_idx" ON "funnels" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "cycles_funnel_idx" ON "growth_cycles" USING btree ("funnel_id","cycle_number");--> statement-breakpoint
CREATE INDEX "hypotheses_funnel_idx" ON "hypotheses" USING btree ("funnel_id");--> statement-breakpoint
CREATE INDEX "hypotheses_status_idx" ON "hypotheses" USING btree ("status");--> statement-breakpoint
CREATE INDEX "jdl_test_idx" ON "judge_decision_log" USING btree ("test_id");--> statement-breakpoint
CREATE INDEX "jdl_dimension_idx" ON "judge_decision_log" USING btree ("dimension_slug");--> statement-breakpoint
CREATE INDEX "jdl_date_idx" ON "judge_decision_log" USING btree ("decided_at");--> statement-breakpoint
CREATE INDEX "angles_funnel_idx" ON "marketing_angles" USING btree ("funnel_id");--> statement-breakpoint
CREATE INDEX "angles_research_niche_idx" ON "marketing_angles_research" USING btree ("niche_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ad_account_meta_idx" ON "meta_ad_accounts" USING btree ("meta_ad_account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_variant_bucket" ON "metrics_5min" USING btree ("variant_id","bucket");--> statement-breakpoint
CREATE UNIQUE INDEX "daily_variant_date" ON "metrics_daily" USING btree ("variant_id","date");--> statement-breakpoint
CREATE INDEX "daily_funnel" ON "metrics_daily" USING btree ("funnel_id","date");--> statement-breakpoint
CREATE UNIQUE INDEX "hourly_variant_hour" ON "metrics_hourly" USING btree ("variant_id","hour");--> statement-breakpoint
CREATE INDEX "offers_product_idx" ON "offers" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "variants_step_idx" ON "page_variants" USING btree ("step_id");--> statement-breakpoint
CREATE INDEX "pixel_funnel_idx" ON "pixel_configs" USING btree ("funnel_id");--> statement-breakpoint
CREATE INDEX "placement_test_campaign" ON "placement_tests" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "product_active_idx" ON "products" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "promo_trigger_idx" ON "promo_auto_rules" USING btree ("trigger_type","trigger_value");--> statement-breakpoint
CREATE INDEX "purchase_funnel_idx" ON "purchases" USING btree ("funnel_id");--> statement-breakpoint
CREATE INDEX "purchase_variant_idx" ON "purchases" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "purchase_email_idx" ON "purchases" USING btree ("customer_email");--> statement-breakpoint
CREATE INDEX "purchase_payment_idx" ON "purchases" USING btree ("payment_transaction_id");--> statement-breakpoint
CREATE INDEX "purchase_status_idx" ON "purchases" USING btree ("status");--> statement-breakpoint
CREATE INDEX "purchase_created_idx" ON "purchases" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "rag_source_type_idx" ON "rag_documents" USING btree ("source_type");--> statement-breakpoint
CREATE INDEX "insights_source_idx" ON "raw_insights" USING btree ("source_id");--> statement-breakpoint
CREATE INDEX "research_source_niche_idx" ON "research_sources" USING btree ("niche_id");--> statement-breakpoint
CREATE INDEX "retention_product_type" ON "retention_triggers" USING btree ("product_id","trigger_type");--> statement-breakpoint
CREATE INDEX "milestones_product_month" ON "subscription_milestones" USING btree ("product_id","month");--> statement-breakpoint
CREATE INDEX "insights_shop_category_idx" ON "survey_insights" USING btree ("shop_id","category");--> statement-breakpoint
CREATE INDEX "responses_survey_idx" ON "survey_responses" USING btree ("survey_id");--> statement-breakpoint
CREATE INDEX "templates_type_idx" ON "templates" USING btree ("type");--> statement-breakpoint
CREATE INDEX "tk_dimension_idx" ON "test_knowledge" USING btree ("dimension_slug");--> statement-breakpoint
CREATE INDEX "tk_active_idx" ON "test_knowledge" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "learnings_fingerprint_idx" ON "test_learnings" USING btree ("variable_fingerprint");--> statement-breakpoint
CREATE INDEX "learnings_funnel_idx" ON "test_learnings" USING btree ("funnel_id");--> statement-breakpoint
CREATE INDEX "queue_test_status" ON "test_queue" USING btree ("test_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "tvm_variant_test" ON "test_variant_metrics" USING btree ("variant_id","test_id");--> statement-breakpoint
CREATE INDEX "tvm_test_idx" ON "test_variant_metrics" USING btree ("test_id");--> statement-breakpoint
CREATE UNIQUE INDEX "utr_test_variant" ON "universal_test_results" USING btree ("test_id","variant_id");--> statement-breakpoint
CREATE INDEX "utr_test_idx" ON "universal_test_results" USING btree ("test_id");--> statement-breakpoint
CREATE INDEX "ut_dimension_idx" ON "universal_tests" USING btree ("dimension_id");--> statement-breakpoint
CREATE INDEX "ut_status_idx" ON "universal_tests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ut_funnel_idx" ON "universal_tests" USING btree ("funnel_id");--> statement-breakpoint
CREATE INDEX "upsell_funnel_idx" ON "upsell_offers" USING btree ("funnel_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_clerk_id_idx" ON "users" USING btree ("clerk_id");--> statement-breakpoint
CREATE INDEX "pattern_type_page_idx" ON "winning_patterns" USING btree ("pattern_type","page_type");--> statement-breakpoint
CREATE INDEX "pattern_status_idx" ON "winning_patterns" USING btree ("status");