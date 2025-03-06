import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  companyUrl: text("company_url").notNull(),
  apiKey: text("api_key").notNull(),
  services: text("services").array().notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// API request schema only includes company_url and api_key
export const apiRequestSchema = z.object({
  company_url: z.string().min(1, "Reference ID is required"),
  api_key: z.string().min(1, "API key is required"),
});

// Full client schema for local storage
export const insertClientSchema = createInsertSchema(clients)
  .extend({
    name: z.string().min(1, "Name is required"),
    companyUrl: z.string().min(1, "Reference ID is required"),
    apiKey: z.string().min(1, "API key is required"),
    services: z.array(z.string()).default(["API Integration", "Data Analytics Dashboard"]),
  })
  .omit({ 
    id: true,
    status: true,
    createdAt: true,
  });

export type InsertClient = z.infer<typeof insertClientSchema>;
export type ApiRequest = z.infer<typeof apiRequestSchema>;
export type Client = typeof clients.$inferSelect;