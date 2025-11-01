import { boolean, index, integer, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";
import { users } from "./users";
import { posts } from "./posts";

export const comments = pgTable(
  "comments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),

    // Relationships
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),

    authorId: text("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // ADJACENCY LIST for threading (simple)
    parentCommentId: text("parent_comment_id")
      .references(() => comments.id, { onDelete: "cascade" }),

    // Content
    body: text("body").notNull(), // Markdown

    // Denormalized counts (PERFORMANCE OPTIMIZATION)
    voteCount: integer("vote_count").default(0).notNull(),
    upvoteCount: integer("upvote_count").default(0).notNull(),
    downvoteCount: integer("downvote_count").default(0).notNull(),
    replyCount: integer("reply_count").default(0).notNull(),

    // Threading depth (for UI limiting - max 10 levels)
    depth: integer("depth").default(0).notNull(),

    // Ranking
    score: real("score").default(0).notNull(),

    // Metadata
    isEdited: boolean("is_edited").default(false).notNull(),
    editedAt: timestamp("edited_at"),

    // Soft delete
    deletedAt: timestamp("deleted_at"),
    deletedBy: text("deleted_by").references(() => users.id),

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
    postIdx: index("idx_comments_post_id").on(table.postId),
    authorIdx: index("idx_comments_author_id").on(table.authorId),
    parentIdx: index("idx_comments_parent_comment_id").on(table.parentCommentId),
    createdIdx: index("idx_comments_created_at").on(table.createdAt),
    scoreIdx: index("idx_comments_score").on(table.score),
    // Composite for fetching post comments
    postScoreIdx: index("idx_comments_post_score").on(table.postId, table.score),
  })
);
