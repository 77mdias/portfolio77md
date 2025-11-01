import { boolean, index, integer, pgTable, real, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";
import { users } from "./users";
import { communities } from "./communities";

export enum PostType {
  TEXT = "text",
  LINK = "link",
  IMAGE = "image",
  VIDEO = "video",
}

export const posts = pgTable(
  "posts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),

    // Relationships
    communityId: text("community_id")
      .notNull()
      .references(() => communities.id, { onDelete: "cascade" }),

    authorId: text("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Content
    title: varchar("title", { length: 300 }).notNull(),
    slug: varchar("slug", { length: 350 }).notNull(), // title-based slug
    body: text("body"), // Markdown content

    postType: varchar("post_type", { length: 10 })
      .notNull()
      .default(PostType.TEXT)
      .$type<PostType>(),

    // External content
    url: text("url"), // For link posts
    thumbnailUrl: text("thumbnail_url"),

    // Metadata
    isPinned: boolean("is_pinned").default(false).notNull(),
    isLocked: boolean("is_locked").default(false).notNull(), // No new comments
    isNsfw: boolean("is_nsfw").default(false).notNull(),
    isSpoiler: boolean("is_spoiler").default(false).notNull(),

    // Denormalized counts (PERFORMANCE OPTIMIZATION)
    voteCount: integer("vote_count").default(0).notNull(), // upvotes - downvotes
    upvoteCount: integer("upvote_count").default(0).notNull(),
    downvoteCount: integer("downvote_count").default(0).notNull(),
    commentCount: integer("comment_count").default(0).notNull(),
    viewCount: integer("view_count").default(0).notNull(),

    // Ranking algorithm fields (Reddit-style hot score)
    score: real("score").default(0).notNull(), // Hot score for sorting

    // Edit tracking
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
    communityIdx: index("idx_posts_community_id").on(table.communityId),
    authorIdx: index("idx_posts_author_id").on(table.authorId),
    slugIdx: index("idx_posts_slug").on(table.slug),
    createdIdx: index("idx_posts_created_at").on(table.createdAt),
    scoreIdx: index("idx_posts_score").on(table.score),
    voteCountIdx: index("idx_posts_vote_count").on(table.voteCount),
    deletedIdx: index("idx_posts_deleted_at").on(table.deletedAt),
    // Composite for community feed
    communityScoreIdx: index("idx_posts_community_score").on(table.communityId, table.score),
  })
);
