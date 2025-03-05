import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClientSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Client creation endpoint
  app.post("/api/clients", async (req, res) => {
    try {
      const clientData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(clientData);
      res.status(201).json(client);
    } catch (error) {
      res.status(400).json({ error: "Invalid client data" });
    }
  });

  // Get all clients
  app.get("/api/clients", async (_req, res) => {
    const clients = await storage.getAllClients();
    res.json(clients);
  });

  // Update client status
  app.patch("/api/clients/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const client = await storage.updateClientStatus(Number(id), status);
      res.json(client);
    } catch (error) {
      res.status(404).json({ error: "Client not found" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
