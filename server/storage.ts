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
    return this.clients.get(id);
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = this.currentId++;
    const client: Client = {
      id,
      ...insertClient,
      status: "pending",
    };
    this.clients.set(id, client);
    return client;
  }

  async updateClientStatus(id: number, status: string): Promise<Client> {
    const client = await this.getClient(id);
    if (!client) throw new Error("Client not found");

    const updatedClient = {
      ...client,
      status
    };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  async getAllClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }
}

export const storage = new MemStorage();