import { boolean, index, pgTable, text, timestamp, unique, varchar } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";
import { users } from "./users";
import { communities } from "./communities";

export enum CommunityRole {
  OWNER = "owner",
  MODERATOR = "moderator",
  MEMBER = "member",
}

export const communityMembers = pgTable(
  "community_members",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),

    communityId: text("community_id")
      .notNull()
      .references(() => communities.id, { onDelete: "cascade" }),

    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    role: varchar("role", { length: 20 })
      .notNull()
      .default(CommunityRole.MEMBER)
      .$type<CommunityRole>(),

    // Member settings
    isMuted: boolean("is_muted").default(false).notNull(), // Can't post/comment
    isBanned: boolean("is_banned").default(false).notNull(),
    banReason: text("ban_reason"),
    bannedUntil: timestamp("banned_until"),

    // Timestamps
    joinedAt: timestamp("joined_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    // Composite unique constraint: user can only join community once
    userCommunityUnique: unique("user_community_unique").on(table.userId, table.communityId),
    communityIdx: index("idx_community_members_community_id").on(table.communityId),
    userIdx: index("idx_community_members_user_id").on(table.userId),
    roleIdx: index("idx_community_members_role").on(table.role),
  })
);
