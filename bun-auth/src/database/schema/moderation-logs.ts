import { index, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";
import { users } from "./users";
import { communities } from "./communities";

export enum ModerationAction {
  DELETE_POST = "delete_post",
  DELETE_COMMENT = "delete_comment",
  BAN_USER = "ban_user",
  UNBAN_USER = "unban_user",
  MUTE_USER = "mute_user",
  UNMUTE_USER = "unmute_user",
  PIN_POST = "pin_post",
  LOCK_POST = "lock_post",
  REMOVE_POST = "remove_post",
  APPROVE_POST = "approve_post",
}

export const moderationLogs = pgTable(
  "moderation_logs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),

    communityId: text("community_id")
      .notNull()
      .references(() => communities.id, { onDelete: "cascade" }),

    moderatorId: text("moderator_id")
      .notNull()
      .references(() => users.id, { onDelete: "set null" }),

    targetUserId: text("target_user_id").references(() => users.id, { onDelete: "set null" }),

    action: varchar("action", { length: 50 })
      .notNull()
      .$type<ModerationAction>(),

    targetType: varchar("target_type", { length: 20 }), // "post", "comment", "user"
    targetId: text("target_id"), // Polymorphic reference

    reason: text("reason"),

    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => ({
    communityIdx: index("idx_moderation_logs_community_id").on(table.communityId),
    moderatorIdx: index("idx_moderation_logs_moderator_id").on(table.moderatorId),
    targetIdx: index("idx_moderation_logs_target").on(table.targetType, table.targetId),
    createdIdx: index("idx_moderation_logs_created_at").on(table.createdAt),
  })
);
