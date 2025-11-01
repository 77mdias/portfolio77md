// Existing auth schemas
import { accounts } from "./accounts";
import { sessions } from "./sessions";
import { users } from "./users";
import { verifications } from "./verifications";

// Forum schemas
import { communities } from "./communities";
import { communityMembers } from "./community-members";
import { communityRules } from "./community-rules";
import { posts } from "./posts";
import { comments } from "./comments";
import { votes } from "./votes";
import { userStats } from "./user-stats";
import { postFlairs, postFlairAssignments } from "./post-flairs";
import { moderationLogs } from "./moderation-logs";
import { rateLimits } from "./rate-limits";

export const schema = {
  // Auth tables
  users,
  accounts,
  verifications,
  sessions,

  // Forum tables
  communities,
  communityMembers,
  communityRules,
  posts,
  comments,
  votes,
  userStats,
  postFlairs,
  postFlairAssignments,
  moderationLogs,
  rateLimits,
};
