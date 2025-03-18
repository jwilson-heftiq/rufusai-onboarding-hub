import { type Client, type InsertClient } from "@shared/schema";

export interface IStorage {
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClientStatus(id: number, status: string): Promise<Client>;
  getAllClients(): Promise<Client[]>;
}

export class MemStorage implements IStorage {
  private clients: Map<number, Client>;
  private currentId: number;

  constructor() {
    this.clients = new Map();
    this.currentId = 1;
  }

  async getClient(id: number): Promise<Client | undefined> {
    const client = this.clients.get(id);
    console.log(`[${new Date().toISOString()}] Retrieved client ${id}:`, client ? 'found' : 'not found');
    return client;
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    try {
      console.log(`[${new Date().toISOString()}] Creating client with data:`, {
        name: insertClient.name,
        companyUrl: insertClient.companyUrl,
        services: insertClient.services
      });

      const id = this.currentId++;

      // Ensure services is an array
      const services = Array.isArray(insertClient.services) 
        ? insertClient.services 
        : [];

      const client: Client = {
        id,
        ...insertClient,
        services,
        status: "pending",
        createdAt: new Date(),
      };

      console.log(`[${new Date().toISOString()}] Generated client object:`, {
        id: client.id,
        name: client.name,
        companyUrl: client.companyUrl,
        status: client.status,
        createdAt: client.createdAt
      });

      this.clients.set(id, client);
      return client;
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error in createClient:`, error);
      throw new Error(`Failed to create client: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateClientStatus(id: number, status: string): Promise<Client> {
    const client = await this.getClient(id);
    if (!client) {
      console.error(`[${new Date().toISOString()}] Failed to update status: Client ${id} not found`);
      throw new Error("Client not found");
    }

    const updatedClient = {
      ...client,
      status
    };

    console.log(`[${new Date().toISOString()}] Updated client ${id} status:`, {
      oldStatus: client.status,
      newStatus: status
    });

    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  async getAllClients(): Promise<Client[]> {
    const clients = Array.from(this.clients.values());
    console.log(`[${new Date().toISOString()}] Retrieved all clients:`, {
      count: clients.length,
      statuses: clients.reduce((acc, client) => {
        acc[client.status] = (acc[client.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    });
    return clients;
  }
}

export const storage = new MemStorage();