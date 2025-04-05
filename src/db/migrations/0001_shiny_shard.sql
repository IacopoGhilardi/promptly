CREATE TYPE "public"."queue_job_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."interval_unit" AS ENUM('hour', 'day', 'week', 'month', 'year');--> statement-breakpoint
CREATE TYPE "public"."recurring_period" AS ENUM('annual', 'monthly', 'weekly', 'daily', 'custom', 'once');--> statement-breakpoint
CREATE TYPE "public"."reminder_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."reminder_status" AS ENUM('pending', 'completed', 'missed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."reminder_type" AS ENUM('task', 'meeting', 'birthday', 'deadline', 'other');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"user_id" integer NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "queue_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"queueName" varchar(50) NOT NULL,
	"jobName" varchar(50) NOT NULL,
	"data" jsonb NOT NULL,
	"status" "queue_job_status" NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "reminders" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"reminderDate" timestamp NOT NULL,
	"reminderTime" timestamp NOT NULL,
	"endTime" timestamp,
	"isRecurring" boolean DEFAULT false,
	"recurringPeriod" "recurring_period",
	"customInterval" integer,
	"intervalUnit" interval_unit,
	"recurringStartDate" timestamp,
	"recurringEndDate" timestamp,
	"reminderType" "reminder_type" DEFAULT 'task' NOT NULL,
	"reminderStatus" "reminder_status" DEFAULT 'pending' NOT NULL,
	"category_id" integer NOT NULL,
	"priority" "reminder_priority" DEFAULT 'medium' NOT NULL,
	"user_id" integer NOT NULL,
	"notifyBefore" integer,
	"notificationSent" boolean DEFAULT false,
	"notes" text,
	"locationText" text,
	"lastOccurrenceDate" timestamp,
	"nextOccurrenceDate" timestamp,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");