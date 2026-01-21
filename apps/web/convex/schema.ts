import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  telemetry: defineTable({
    command: v.union(
      v.literal("add"),
      v.literal("update"),
      v.literal("remove"),
      v.literal("list"),
      v.literal("search"),
      v.literal("outdated"),
      v.literal("clean")
    ),
    type: v.optional(v.union(v.literal("skill"), v.literal("command"))),
    repo: v.optional(v.string()),
    name: v.optional(v.string()),
    skill: v.optional(v.string()),
    agent: v.optional(v.string()),
    scope: v.optional(v.union(v.literal("global"), v.literal("project"))),
    success: v.optional(v.boolean()),
    timestamp: v.number(),
    osPlatform: v.string(),
    osArch: v.string(),
    nodeVersion: v.string(),
    cliVersion: v.string(),
  })
    .index("by_command", ["command"])
    .index("by_type", ["type"])
    .index("by_repo", ["repo"])
    .index("by_name", ["name"])
    .index("by_timestamp", ["timestamp"])
    .index("by_cli_version", ["cliVersion"]),
});
