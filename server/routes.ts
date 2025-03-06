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
      console.log('Received request body:', req.body);

      // Validate the incoming data
      const validatedData = insertClientSchema.safeParse(req.body);

      if (!validatedData.success) {
        console.error('Validation error:', validatedData.error);
        const validationError = fromZodError(validatedData.error);
        return res.status(400).json({ 
          error: 'Validation failed',
          details: validationError.message
        });
      }

      // Create client with validated data
      const client = await storage.createClient(validatedData.data);
      console.log('Created client:', client);
      res.status(201).json(client);
    } catch (error) {
      console.error('Client creation error:', error);
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
  app.get("/api/clients", async (_req, res) => {
    try {
      const clients = await storage.getAllClients();
      res.json(clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
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
      const client = await storage.updateClientStatus(Number(id), status);
      res.json(client);
    } catch (error) {
      console.error('Error updating client status:', error);
      res.status(404).json({ 
        error: "Failed to update client",
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}