import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClientSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Client creation endpoint
  app.post("/api/clients", async (req, res) => {
    try {
      console.log(`[${new Date().toISOString()}] POST /api/clients - Request body:`, {
        name: req.body.name,
        companyUrl: req.body.companyUrl,
        services: req.body.services
      });

      // Validate the incoming data against full schema
      const validatedData = insertClientSchema.safeParse(req.body);

      if (!validatedData.success) {
        console.error(`[${new Date().toISOString()}] Validation error for client creation:`, 
          validatedData.error.errors);
        const validationError = fromZodError(validatedData.error);
        return res.status(400).json({ 
          error: 'Validation failed',
          details: validationError.message
        });
      }

      // Create client with validated data
      const client = await storage.createClient(validatedData.data);
      console.log(`[${new Date().toISOString()}] Successfully created client:`, {
        id: client.id,
        name: client.name,
        status: client.status
      });
      res.status(201).json(client);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Client creation error:`, error);
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          error: 'Validation failed',
          details: validationError.message
        });
      }
      res.status(500).json({ 
        error: "Failed to create client",
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  });

  // Get all clients
  app.get("/api/clients", async (req, res) => {
    try {
      console.log(`[${new Date().toISOString()}] GET /api/clients - Request from:`, {
        ip: req.ip,
        userAgent: req.get('user-agent')
      });

      // Check for Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        console.warn(`[${new Date().toISOString()}] Unauthorized access attempt to GET /api/clients`);
        return res.status(401).json({ error: 'No token provided' });
      }

      const clients = await storage.getAllClients();
      console.log(`[${new Date().toISOString()}] Successfully retrieved ${clients.length} clients`);
      res.json(clients);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error fetching clients:`, error);
      res.status(500).json({ 
        error: "Failed to fetch clients",
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  });

  // Update client status
  app.patch("/api/clients/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      console.log(`[${new Date().toISOString()}] PATCH /api/clients/${id}/status - Updating status to:`, status);
      const client = await storage.updateClientStatus(Number(id), status);
      console.log(`[${new Date().toISOString()}] Successfully updated client ${id} status to ${status}`);
      res.json(client);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error updating client ${id} status:`, error);
      res.status(404).json({ 
        error: "Failed to update client",
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}