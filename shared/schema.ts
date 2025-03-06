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

export const insertClientSchema = createInsertSchema(clients, {
  name: z.string().min(1, "Name is required"),
  companyUrl: z.string().url("Please enter a valid URL").min(1, "Company URL is required"),
  apiKey: z.string().min(1, "API key is required"),
  services: z.array(z.string()).min(1, "At least one service must be selected"),
}).omit({ 
  id: true,
  status: true,
  createdAt: true,
});

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;