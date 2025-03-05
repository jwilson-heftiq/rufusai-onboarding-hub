import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  companyUrl: text("company_url").notNull(),
  apiKey: text("api_key").notNull(),
  services: text("services").array().notNull(),
  status: text("status").notNull().default("pending"),
});

export const insertClientSchema = createInsertSchema(clients, {
  name: z.string().min(1, "Name is required"),
  companyUrl: z.string().min(1, "Company reference is required"),
  apiKey: z.string().min(1, "API key is required"),
  services: z.array(z.string()),
}).omit({ 
  id: true,
  status: true,
});

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;