CREATE TYPE "promptly"."queue_job_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "promptly"."queue_job_type" AS ENUM('reminder_email', 'reminder_sms', 'reminder_push');--> statement-breakpoint
CREATE TYPE "promptly"."interval_unit" AS ENUM('hour', 'day', 'week', 'month', 'year');--> statement-breakpoint
CREATE TYPE "promptly"."recurring_period" AS ENUM('annual', 'monthly', 'weekly', 'daily', 'custom', 'once');--> statement-breakpoint
CREATE TYPE "promptly"."reminder_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "promptly"."reminder_status" AS ENUM('pending', 'completed', 'missed', 'cancelled');--> statement-breakpoint
CREATE TYPE "promptly"."reminder_type" AS ENUM('task', 'meeting', 'birthday', 'deadline', 'other');--> statement-breakpoint
CREATE TABLE "promptly"."categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"user_id" integer NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "promptly"."queues" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"concurrency" integer DEFAULT 1 NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "queues_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "promptly"."queue_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"queue_name" varchar(50) NOT NULL,
	"job_name" varchar(50) NOT NULL,
	"data" jsonb NOT NULL,
	"status" "promptly"."queue_job_status" NOT NULL,
	"type" "promptly"."queue_job_type" NOT NULL,
	"queue_id" serial NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "promptly"."reminders" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"reminder_date" timestamp NOT NULL,
	"reminder_time" timestamp NOT NULL,
	"end_time" timestamp,
	"is_active" boolean DEFAULT true,
	"is_recurring" boolean DEFAULT false,
	"recurring_period" "promptly"."recurring_period",
	"custom_interval" integer,
	"interval_unit" interval_unit,
	"recurring_start_date" timestamp,
	"recurring_end_date" timestamp,
	"reminder_type" "promptly"."reminder_type" DEFAULT 'task' NOT NULL,
	"reminder_status" "promptly"."reminder_status" DEFAULT 'pending' NOT NULL,
	"category_id" integer NOT NULL,
	"priority" "promptly"."reminder_priority" DEFAULT 'medium' NOT NULL,
	"user_id" integer NOT NULL,
	"notify_before" integer,
	"notification_sent" boolean DEFAULT false,
	"notes" text,
	"location_text" text,
	"last_occurrence_date" timestamp,
	"next_occurrence_date" timestamp,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "promptly"."users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"email" varchar(50) NOT NULL,
	"password" text NOT NULL,
	"public_id" uuid NOT NULL,
	"email_notifications" boolean DEFAULT true NOT NULL,
	"sms_notifications" boolean DEFAULT true NOT NULL,
	"push_notifications" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
ALTER TABLE "promptly"."categories" ADD CONSTRAINT "categories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "promptly"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promptly"."queue_jobs" ADD CONSTRAINT "queue_jobs_queue_id_queues_id_fk" FOREIGN KEY ("queue_id") REFERENCES "promptly"."queues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promptly"."reminders" ADD CONSTRAINT "reminders_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "promptly"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promptly"."reminders" ADD CONSTRAINT "reminders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "promptly"."users"("id") ON DELETE no action ON UPDATE no action;