import { boolean, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";
import { users } from "./users";

export const communities = pgTable("communities", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),

  // Basic Info
  name: varchar("name", { length: 21 }).notNull().unique(), // Reddit limit
  displayName: varchar("display_name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 21 }).notNull().unique(), // URL-friendly
  description: text("description"),
  iconUrl: text("icon_url"),
  bannerUrl: text("banner_url"),

  // Ownership
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),

  // Settings
  isPrivate: boolean("is_private").default(false).notNull(),
  isNsfw: boolean("is_nsfw").default(false).notNull(),
  allowImages: boolean("allow_images").default(true).notNull(),
  allowVideos: boolean("allow_videos").default(true).notNull(),

  // Stats (denormalized)
  memberCount: integer("member_count").default(0).notNull(),
  postCount: integer("post_count").default(0).notNull(),

  // Moderation
  minKarmaToPost: integer("min_karma_to_post").default(0).notNull(),

  // Custom Styling
  primaryColor: varchar("primary_color", { length: 7 }).default("#FF5700"), // Hex color

  // Soft Delete
  deletedAt: timestamp("deleted_at"),

  // Timestamps
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
});
