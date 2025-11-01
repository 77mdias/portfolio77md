CREATE TABLE "communities" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(21) NOT NULL,
	"display_name" varchar(100) NOT NULL,
	"slug" varchar(21) NOT NULL,
	"description" text,
	"icon_url" text,
	"banner_url" text,
	"owner_id" text NOT NULL,
	"is_private" boolean DEFAULT false NOT NULL,
	"is_nsfw" boolean DEFAULT false NOT NULL,
	"allow_images" boolean DEFAULT true NOT NULL,
	"allow_videos" boolean DEFAULT true NOT NULL,
	"member_count" integer DEFAULT 0 NOT NULL,
	"post_count" integer DEFAULT 0 NOT NULL,
	"min_karma_to_post" integer DEFAULT 0 NOT NULL,
	"primary_color" varchar(7) DEFAULT '#FF5700',
	"deleted_at" timestamp,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "communities_name_unique" UNIQUE("name"),
	CONSTRAINT "communities_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "community_members" (
	"id" text PRIMARY KEY NOT NULL,
	"community_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" varchar(20) DEFAULT 'member' NOT NULL,
	"is_muted" boolean DEFAULT false NOT NULL,
	"is_banned" boolean DEFAULT false NOT NULL,
	"ban_reason" text,
	"banned_until" timestamp,
	"joined_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_community_unique" UNIQUE("user_id","community_id")
);
--> statement-breakpoint
CREATE TABLE "community_rules" (
	"id" text PRIMARY KEY NOT NULL,
	"community_id" text NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"position" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" text PRIMARY KEY NOT NULL,
	"community_id" text NOT NULL,
	"author_id" text NOT NULL,
	"title" varchar(300) NOT NULL,
	"slug" varchar(350) NOT NULL,
	"body" text,
	"post_type" varchar(10) DEFAULT 'text' NOT NULL,
	"url" text,
	"thumbnail_url" text,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"is_locked" boolean DEFAULT false NOT NULL,
	"is_nsfw" boolean DEFAULT false NOT NULL,
	"is_spoiler" boolean DEFAULT false NOT NULL,
	"vote_count" integer DEFAULT 0 NOT NULL,
	"upvote_count" integer DEFAULT 0 NOT NULL,
	"downvote_count" integer DEFAULT 0 NOT NULL,
	"comment_count" integer DEFAULT 0 NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"score" real DEFAULT 0 NOT NULL,
	"edited_at" timestamp,
	"deleted_at" timestamp,
	"deleted_by" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"author_id" text NOT NULL,
	"parent_comment_id" text,
	"body" text NOT NULL,
	"vote_count" integer DEFAULT 0 NOT NULL,
	"upvote_count" integer DEFAULT 0 NOT NULL,
	"downvote_count" integer DEFAULT 0 NOT NULL,
	"reply_count" integer DEFAULT 0 NOT NULL,
	"depth" integer DEFAULT 0 NOT NULL,
	"score" real DEFAULT 0 NOT NULL,
	"is_edited" boolean DEFAULT false NOT NULL,
	"edited_at" timestamp,
	"deleted_at" timestamp,
	"deleted_by" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"votable_type" varchar(10) NOT NULL,
	"votable_id" text NOT NULL,
	"vote_type" varchar(10) NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_votable_unique" UNIQUE("user_id","votable_type","votable_id")
);
--> statement-breakpoint
CREATE TABLE "user_stats" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"post_karma" integer DEFAULT 0 NOT NULL,
	"comment_karma" integer DEFAULT 0 NOT NULL,
	"total_karma" integer DEFAULT 0 NOT NULL,
	"post_count" integer DEFAULT 0 NOT NULL,
	"comment_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_stats_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "post_flair_assignments" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"flair_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "post_flair_assignments_post_id_unique" UNIQUE("post_id")
);
--> statement-breakpoint
CREATE TABLE "post_flairs" (
	"id" text PRIMARY KEY NOT NULL,
	"community_id" text NOT NULL,
	"name" varchar(50) NOT NULL,
	"text_color" varchar(7) DEFAULT '#FFFFFF' NOT NULL,
	"background_color" varchar(7) DEFAULT '#0079D3' NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "moderation_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"community_id" text NOT NULL,
	"moderator_id" text NOT NULL,
	"target_user_id" text,
	"action" varchar(50) NOT NULL,
	"target_type" varchar(20),
	"target_id" text,
	"reason" text,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"action_type" varchar(30) NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	"window_start" timestamp NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "communities" ADD CONSTRAINT "communities_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_members" ADD CONSTRAINT "community_members_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_members" ADD CONSTRAINT "community_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_rules" ADD CONSTRAINT "community_rules_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_deleted_by_users_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_comment_id_comments_id_fk" FOREIGN KEY ("parent_comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_deleted_by_users_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_stats" ADD CONSTRAINT "user_stats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_flair_assignments" ADD CONSTRAINT "post_flair_assignments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_flair_assignments" ADD CONSTRAINT "post_flair_assignments_flair_id_post_flairs_id_fk" FOREIGN KEY ("flair_id") REFERENCES "public"."post_flairs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_flairs" ADD CONSTRAINT "post_flairs_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_logs" ADD CONSTRAINT "moderation_logs_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_logs" ADD CONSTRAINT "moderation_logs_moderator_id_users_id_fk" FOREIGN KEY ("moderator_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_logs" ADD CONSTRAINT "moderation_logs_target_user_id_users_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rate_limits" ADD CONSTRAINT "rate_limits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_community_members_community_id" ON "community_members" USING btree ("community_id");--> statement-breakpoint
CREATE INDEX "idx_community_members_user_id" ON "community_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_community_members_role" ON "community_members" USING btree ("role");--> statement-breakpoint
CREATE INDEX "idx_community_rules_community_id" ON "community_rules" USING btree ("community_id");--> statement-breakpoint
CREATE INDEX "idx_community_rules_position" ON "community_rules" USING btree ("position");--> statement-breakpoint
CREATE INDEX "idx_posts_community_id" ON "posts" USING btree ("community_id");--> statement-breakpoint
CREATE INDEX "idx_posts_author_id" ON "posts" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "idx_posts_slug" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_posts_created_at" ON "posts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_posts_score" ON "posts" USING btree ("score");--> statement-breakpoint
CREATE INDEX "idx_posts_vote_count" ON "posts" USING btree ("vote_count");--> statement-breakpoint
CREATE INDEX "idx_posts_deleted_at" ON "posts" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "idx_posts_community_score" ON "posts" USING btree ("community_id","score");--> statement-breakpoint
CREATE INDEX "idx_comments_post_id" ON "comments" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "idx_comments_author_id" ON "comments" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "idx_comments_parent_comment_id" ON "comments" USING btree ("parent_comment_id");--> statement-breakpoint
CREATE INDEX "idx_comments_created_at" ON "comments" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_comments_score" ON "comments" USING btree ("score");--> statement-breakpoint
CREATE INDEX "idx_comments_post_score" ON "comments" USING btree ("post_id","score");--> statement-breakpoint
CREATE INDEX "idx_votes_user_id" ON "votes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_votes_votable" ON "votes" USING btree ("votable_type","votable_id");--> statement-breakpoint
CREATE INDEX "idx_user_stats_user_id_unique" ON "user_stats" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_stats_total_karma" ON "user_stats" USING btree ("total_karma");--> statement-breakpoint
CREATE INDEX "idx_post_flair_assignments_flair_id" ON "post_flair_assignments" USING btree ("flair_id");--> statement-breakpoint
CREATE INDEX "idx_post_flairs_community_id" ON "post_flairs" USING btree ("community_id");--> statement-breakpoint
CREATE INDEX "idx_moderation_logs_community_id" ON "moderation_logs" USING btree ("community_id");--> statement-breakpoint
CREATE INDEX "idx_moderation_logs_moderator_id" ON "moderation_logs" USING btree ("moderator_id");--> statement-breakpoint
CREATE INDEX "idx_moderation_logs_target" ON "moderation_logs" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE INDEX "idx_moderation_logs_created_at" ON "moderation_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_rate_limits_user_action" ON "rate_limits" USING btree ("user_id","action_type");--> statement-breakpoint
CREATE INDEX "idx_rate_limits_expires_at" ON "rate_limits" USING btree ("expires_at");