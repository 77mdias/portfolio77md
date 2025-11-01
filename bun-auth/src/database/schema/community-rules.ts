import { index, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { randomUUID } from "node:crypto";
import { communities } from "./communities";

export const communityRules = pgTable(
  "community_rules",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),

    communityId: text("community_id")
      .notNull()
      .references(() => communities.id, { onDelete: "cascade" }),

    title: varchar("title", { length: 100 }).notNull(),
    description: text("description").notNull(),

    // Display order
    position: integer("position").notNull(),

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
    communityIdx: index("idx_community_rules_community_id").on(table.communityId),
    positionIdx: index("idx_community_rules_position").on(table.position),
  })
);
