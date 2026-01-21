import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

const eventValidator = {
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
};

export const record = internalMutation({
  args: eventValidator,
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert("telemetry", args);
    return null;
  },
});

export const recordBatch = internalMutation({
  args: {
    events: v.array(v.object(eventValidator)),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    for (const event of args.events) {
      await ctx.db.insert("telemetry", event);
    }
    return null;
  },
});
