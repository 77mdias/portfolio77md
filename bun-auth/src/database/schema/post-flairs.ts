import { index, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";
import { communities } from "./communities";
import { posts } from "./posts";

export const postFlairs = pgTable(
  "post_flairs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),

    communityId: text("community_id")
      .notNull()
      .references(() => communities.id, { onDelete: "cascade" }),

    name: varchar("name", { length: 50 }).notNull(),

    // Styling
    textColor: varchar("text_color", { length: 7 }).default("#FFFFFF").notNull(),
    backgroundColor: varchar("background_color", { length: 7 }).default("#0079D3").notNull(),

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
    communityIdx: index("idx_post_flairs_community_id").on(table.communityId),
  })
);

// Junction table: posts can have ONE flair
export const postFlairAssignments = pgTable(
  "post_flair_assignments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),

    postId: text("post_id")
      .notNull()
      .unique() // Each post has max ONE flair
      .references(() => posts.id, { onDelete: "cascade" }),

    flairId: text("flair_id")
      .notNull()
      .references(() => postFlairs.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => ({
    flairIdx: index("idx_post_flair_assignments_flair_id").on(table.flairId),
  })
);
