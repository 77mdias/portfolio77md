import { index, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";
import { users } from "./users";

export enum RateLimitType {
  POST_CREATE = "post_create",
  COMMENT_CREATE = "comment_create",
  VOTE = "vote",
  COMMUNITY_CREATE = "community_create",
}

export const rateLimits = pgTable(
  "rate_limits",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),

    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    actionType: varchar("action_type", { length: 30 })
      .notNull()
      .$type<RateLimitType>(),

    // Sliding window counter
    count: integer("count").default(1).notNull(),
    windowStart: timestamp("window_start")
      .$defaultFn(() => new Date())
      .notNull(),

    // Auto-cleanup
    expiresAt: timestamp("expires_at").notNull(),

    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    userActionIdx: index("idx_rate_limits_user_action").on(table.userId, table.actionType),
    expiresIdx: index("idx_rate_limits_expires_at").on(table.expiresAt),
  })
);
