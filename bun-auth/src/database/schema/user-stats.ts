import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";
import { users } from "./users";

export const userStats = pgTable(
  "user_stats",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),

    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),

    // Karma (denormalized)
    postKarma: integer("post_karma").default(0).notNull(),
    commentKarma: integer("comment_karma").default(0).notNull(),
    totalKarma: integer("total_karma").default(0).notNull(), // post + comment

    // Activity counts
    postCount: integer("post_count").default(0).notNull(),
    commentCount: integer("comment_count").default(0).notNull(),

    // Timestamps
    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    userUniqueIdx: index("idx_user_stats_user_id_unique").on(table.userId),
    totalKarmaIdx: index("idx_user_stats_total_karma").on(table.totalKarma),
  })
);
