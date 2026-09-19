import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ropa_records: defineTable({
    purpose: v.string(),
    legalBasis: v.string(),
    retentionPeriod: v.string(),
    dataSubjects: v.string(),
    dataCategories: v.array(v.string()),
    securityMeasures: v.string(),
    createdAt: v.string(),
  }),

  nis2_logs: defineTable({
    event: v.string(),
    severity: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical")),
    actor: v.string(),
    ipAddress: v.string(),
    details: v.string(),
    timestamp: v.string(),
  }),

  security_snapshots: defineTable({
    version: v.string(),
    systemState: v.string(), // "nominal" | "degraded" | "breached"
    checksum: v.string(),
    configurationDump: v.string(),
    createdAt: v.string(),
  }),

  tickets: defineTable({
    category: v.string(), // "osvetleni" | "komunikace" | "zelen" | "odpady" | "ostatni"
    title: v.string(),
    description: v.string(),
    location: v.string(),
    latitude: v.float64(),
    longitude: v.float64(),
    photoUrl: v.optional(v.string()),
    status: v.union(v.literal("nove"), v.literal("reseni"), v.literal("hotovo")),
    contactEmail: v.string(),
    contactPhone: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
    isAnonymized: v.boolean(),
    officialResolutionNote: v.optional(v.string()),
  }),
});
