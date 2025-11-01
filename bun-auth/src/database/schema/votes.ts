import { index, pgTable, text, timestamp, unique, varchar } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";
import { users } from "./users";

export enum VoteType {
  UPVOTE = "upvote",
  DOWNVOTE = "downvote",
}

export enum VotableType {
  POST = "post",
  COMMENT = "comment",
}

export const votes = pgTable(
  "votes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),

    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Polymorphic voting (posts OR comments)
    votableType: varchar("votable_type", { length: 10 })
      .notNull()
      .$type<VotableType>(),

    votableId: text("votable_id").notNull(), // post.id or comment.id

    voteType: varchar("vote_type", { length: 10 })
      .notNull()
      .$type<VoteType>(),

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
    userIdx: index("idx_votes_user_id").on(table.userId),
    votableIdx: index("idx_votes_votable").on(table.votableType, table.votableId),
    // UNIQUE: user can only vote once per item
    userVotableUnique: unique("user_votable_unique").on(
      table.userId,
      table.votableType,
      table.votableId
    ),
  })
);
