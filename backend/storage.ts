import {
  orders,
  pricingItems,
  serviceCategories,
  serviceProviders,
  serviceRequests,
  users,
  type InsertOrder,
  type InsertPricingItem,
  type InsertServiceCategory,
  type InsertServiceProvider,
  type InsertServiceRequest,
  type InsertUser,
  type Order,
  type PricingItem,
  type ServiceCategory,
  type ServiceProvider,
  type ServiceRequest,
  type User,
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Service Providers
  getServiceProvider(id: number): Promise<ServiceProvider | undefined>;
  getAllServiceProviders(): Promise<ServiceProvider[]>;
  getAvailableServiceProviders(): Promise<ServiceProvider[]>;
  createServiceProvider(
    provider: InsertServiceProvider,
  ): Promise<ServiceProvider>;
  updateServiceProviderAvailability(
    id: number,
    isAvailable: boolean,
  ): Promise<void>;

  // Service Categories
  getAllServiceCategories(): Promise<ServiceCategory[]>;
  getServiceCategory(id: number): Promise<ServiceCategory | undefined>;
  createServiceCategory(
    category: InsertServiceCategory,
  ): Promise<ServiceCategory>;

  // Pricing Items
  getPricingItemsByCategory(categoryId: number): Promise<PricingItem[]>;
  getAllPricingItems(): Promise<PricingItem[]>;
  createPricingItem(item: InsertPricingItem): Promise<PricingItem>;

  // Service Requests
  getServiceRequest(id: number): Promise<ServiceRequest | undefined>;
  getUserServiceRequests(userId: number): Promise<ServiceRequest[]>;
  createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest>;
  updateServiceRequest(
    id: number,
    updates: Partial<ServiceRequest>,
  ): Promise<ServiceRequest>;

  // Orders
  getOrder(id: number): Promise<Order | undefined>;
  getUserOrders(userId: number): Promise<Order[]>;
  getProviderOrders(providerId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, updates: Partial<Order>): Promise<Order>;
  getUserActiveOrder(userId: number): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private serviceProviders: Map<number, ServiceProvider> = new Map();
  private serviceCategories: Map<number, ServiceCategory> = new Map();
  private serviceRequests: Map<number, ServiceRequest> = new Map();
  private orders: Map<number, Order> = new Map();
  private pricingItems: Map<number, PricingItem> = new Map();

  private currentUserId = 1;
  private currentProviderId = 1;
  private currentCategoryId = 1;
  private currentRequestId = 1;
  private currentOrderId = 1;
  private currentPricingItemId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed service categories
    const categories: ServiceCategory[] = [
      {
        id: this.currentCategoryId++,
        name: "Furniture Removal",
        description: "Couches, chairs, mattresses & more",
        basePrice: "85.00",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150",
        serviceType: "standard",
        isRecurring: false,
      },
      {
        id: this.currentCategoryId++,
        name: "Appliance Removal",
        description: "Washers, dryers, refrigerators & more",
        basePrice: "75.00",
        image:
          "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150",
        serviceType: "standard",
        isRecurring: false,
      },
      {
        id: this.currentCategoryId++,
        name: "Yard Waste Removal",
        description: "Leaves, branches & yard debris",
        basePrice: "50.00",
        image:
          "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150",
        serviceType: "standard",
        isRecurring: true,
      },
      {
        id: this.currentCategoryId++,
        name: "Electronics & Misc",
        description: "TVs, computers & miscellaneous items",
        basePrice: "30.00",
        image:
          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150",
        serviceType: "standard",
        isRecurring: false,
      },
      {
        id: this.currentCategoryId++,
        name: "Construction Debris",
        description: "Renovation & construction waste",
        basePrice: "150.00",
        image:
          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150",
        serviceType: "demolition",
        isRecurring: false,
      },
      {
        id: this.currentCategoryId++,
        name: "Donation/Transport",
        description: "Item delivery & donation services",
        basePrice: "75.00",
        image:
          "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150",
        serviceType: "you_load",
        isRecurring: false,
      },
    ];

    categories.forEach((cat) => this.serviceCategories.set(cat.id, cat));

    // Seed pricing items based on the provided pricing sheet
    const pricingItemsData: PricingItem[] = [
      // Furniture Removal (Category 1)
      {
        id: this.currentPricingItemId++,
        categoryId: 1,
        serviceDescription: "Couch/Sofa (3-seater)",
        minPrice: "85.00",
        maxPrice: "120.00",
        isAddOn: false,
      },
      {
        id: this.currentPricingItemId++,
        categoryId: 1,
        serviceDescription: "Recliner/Chair",
        minPrice: "60.00",
        maxPrice: "90.00",
        isAddOn: false,
      },
      {
        id: this.currentPricingItemId++,
        categoryId: 1,
        serviceDescription: "Mattress & Box Spring",
        minPrice: "90.00",
        maxPrice: "120.00",
        isAddOn: false,
      },
      {
        id: this.currentPricingItemId++,
        categoryId: 1,
        serviceDescription: "Bed Frame (disassembled)",
        minPrice: "40.00",
        maxPrice: "60.00",
        isAddOn: false,
      },

      // Appliance Removal (Category 2)
      {
        id: this.currentPricingItemId++,
        categoryId: 2,
        serviceDescription: "Washer or Dryer",
        minPrice: "75.00",
        maxPrice: "95.00",
        isAddOn: false,
      },
      {
        id: this.currentPricingItemId++,
        categoryId: 2,
        serviceDescription: "Refrigerator",
        minPrice: "100.00",
        maxPrice: "140.00",
        isAddOn: false,
      },
      {
        id: this.currentPricingItemId++,
        categoryId: 2,
        serviceDescription: "Dishwasher/Microwave",
        minPrice: "60.00",
        maxPrice: "80.00",
        isAddOn: false,
      },
      {
        id: this.currentPricingItemId++,
        categoryId: 2,
        serviceDescription: "Stove/Oven",
        minPrice: "85.00",
        maxPrice: "110.00",
        isAddOn: false,
      },
      {
        id: this.currentPricingItemId++,
        categoryId: 2,
        serviceDescription: "Water Heater",
        minPrice: "70.00",
        maxPrice: "90.00",
        isAddOn: false,
      },

      // Yard Waste Removal (Category 3)
      {
        id: this.currentPricingItemId++,
        categoryId: 3,
        serviceDescription: "Bagged Leaves (10 bags)",
        minPrice: "50.00",
        maxPrice: "70.00",
        isAddOn: false,
      },
      {
        id: this.currentPricingItemId++,
        categoryId: 3,
        serviceDescription: "Small Tree Branch Load",
        minPrice: "90.00",
        maxPrice: "120.00",
        isAddOn: false,
      },
      {
        id: this.currentPricingItemId++,
        categoryId: 3,
        serviceDescription: "Full Branch Load",
        minPrice: "250.00",
        maxPrice: "300.00",
        isAddOn: false,
      },
      {
        id: this.currentPricingItemId++,
        categoryId: 3,
        serviceDescription: "Lawn Furniture (each)",
        minPrice: "40.00",
        maxPrice: "60.00",
        isAddOn: false,
      },

      // Electronics & Misc (Category 4)
      {
        id: this.currentPricingItemId++,
        categoryId: 4,
        serviceDescription: 'TV (under 40")',
        minPrice: "50.00",
        maxPrice: "70.00",
        isAddOn: false,
      },
      {
        id: this.currentPricingItemId++,
        categoryId: 4,
        serviceDescription: "Large TV",
        minPrice: "80.00",
        maxPrice: "110.00",
        isAddOn: false,
      },
      {
        id: this.currentPricingItemId++,
        categoryId: 4,
        serviceDescription: "Computer or Monitor",
        minPrice: "30.00",
        maxPrice: "50.00",
        isAddOn: false,
      },
      {
        id: this.currentPricingItemId++,
        categoryId: 4,
        serviceDescription: "Tires (each)",
        minPrice: "15.00",
        maxPrice: "20.00",
        isAddOn: false,
      },
      {
        id: this.currentPricingItemId++,
        categoryId: 4,
        serviceDescription: "Bags of Junk (each)",
        minPrice: "20.00",
        maxPrice: "30.00",
        isAddOn: true,
      },
      {
        id: this.currentPricingItemId++,
        categoryId: 4,
        serviceDescription: "Box of Clothes/Books",
        minPrice: "15.00",
        maxPrice: "25.00",
        isAddOn: true,
      },

      // Construction Debris (Category 5)
      {
        id: this.currentPricingItemId++,
        categoryId: 5,
        serviceDescription: "Bathroom Remodel Load",
        minPrice: "200.00",
        maxPrice: "300.00",
        isAddOn: false,
      },
      {
        id: this.currentPricingItemId++,
        categoryId: 5,
        serviceDescription: "Sheetrock/Wood Load",
        minPrice: "150.00",
        maxPrice: "250.00",
        isAddOn: false,
      },
      {
        id: this.currentPricingItemId++,
        categoryId: 5,
        serviceDescription: "Tile/Concrete Load",
        minPrice: "200.00",
        maxPrice: "350.00",
        isAddOn: false,
      },
      {
        id: this.currentPricingItemId++,
        categoryId: 5,
        serviceDescription: "Rolled Carpet (per room)",
        minPrice: "75.00",
        maxPrice: "100.00",
        isAddOn: false,
      },

      // Donation/Transport (Category 6)
      {
        id: this.currentPricingItemId++,
        categoryId: 6,
        serviceDescription: "Single Item Delivery",
        minPrice: "75.00",
        maxPrice: "100.00",
        isAddOn: false,
      },
      {
        id: this.currentPricingItemId++,
        categoryId: 6,
        serviceDescription: "2–3 Medium Items",
        minPrice: "100.00",
        maxPrice: "150.00",
        isAddOn: false,
      },
      {
        id: this.currentPricingItemId++,
        categoryId: 6,
        serviceDescription: "Small Apartment Move",
        minPrice: "200.00",
        maxPrice: "300.00",
        isAddOn: false,
      },
      {
        id: this.currentPricingItemId++,
        categoryId: 6,
        serviceDescription: "Full House Move",
        minPrice: "400.00",
        maxPrice: "600.00",
        isAddOn: false,
      },
      {
        id: this.currentPricingItemId++,
        categoryId: 6,
        serviceDescription: "Donation Load (Full)",
        minPrice: "250.00",
        maxPrice: "300.00",
        isAddOn: false,
      },

      // Clothing - special category items
      {
        id: this.currentPricingItemId++,
        categoryId: 4,
        serviceDescription: "1–5 Bags of Clothes",
        minPrice: "50.00",
        maxPrice: "65.00",
        isAddOn: false,
      },
      {
        id: this.currentPricingItemId++,
        categoryId: 4,
        serviceDescription: "Add-On: Bags of Clothes",
        minPrice: "20.00",
        maxPrice: "30.00",
        isAddOn: true,
      },
    ];

    pricingItemsData.forEach((item) => this.pricingItems.set(item.id, item));

    // Seed service providers
    const providers: ServiceProvider[] = [
      {
        id: this.currentProviderId++,
        name: "Mike Johnson",
        email: "mike@instanthaul.com",
        phone: "(555) 123-4567",
        vehicle: "2019 Ford F-150",
        license: "ABC123",
        rating: "4.9",
        totalJobs: 324,
        isAvailable: true,
        profileImage:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        createdAt: new Date(),
      },
      {
        id: this.currentProviderId++,
        name: "Sarah Chen",
        email: "sarah@instanthaul.com",
        phone: "(555) 234-5678",
        vehicle: "2020 Chevrolet Silverado",
        license: "XYZ789",
        rating: "4.8",
        totalJobs: 256,
        isAvailable: true,
        profileImage:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        createdAt: new Date(),
      },
    ];

    providers.forEach((provider) =>
      this.serviceProviders.set(provider.id, provider),
    );

    // Seed a test user
    const testUser: User = {
      id: this.currentUserId++,
      username: "testuser",
      email: "test@example.com",
      password: "password",
      address: "123 Main St, San Francisco, CA",
      phone: "(555) 987-6543",
      createdAt: new Date(),
    };

    this.users.set(testUser.id, testUser);
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      phone: insertUser.phone || null,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  // Service Providers
  async getServiceProvider(id: number): Promise<ServiceProvider | undefined> {
    return this.serviceProviders.get(id);
  }

  async getAllServiceProviders(): Promise<ServiceProvider[]> {
    return Array.from(this.serviceProviders.values());
  }

  async getAvailableServiceProviders(): Promise<ServiceProvider[]> {
    return Array.from(this.serviceProviders.values()).filter(
      (p) => p.isAvailable,
    );
  }

  async createServiceProvider(
    insertProvider: InsertServiceProvider,
  ): Promise<ServiceProvider> {
    const provider: ServiceProvider = {
      ...insertProvider,
      id: this.currentProviderId++,
      rating: "0",
      totalJobs: 0,
      isAvailable: true,
      profileImage: insertProvider.profileImage || null,
      createdAt: new Date(),
    };
    this.serviceProviders.set(provider.id, provider);
    return provider;
  }

  async updateServiceProviderAvailability(
    id: number,
    isAvailable: boolean,
  ): Promise<void> {
    const provider = this.serviceProviders.get(id);
    if (provider) {
      provider.isAvailable = isAvailable;
      this.serviceProviders.set(id, provider);
    }
  }

  // Service Categories
  async getAllServiceCategories(): Promise<ServiceCategory[]> {
    return Array.from(this.serviceCategories.values());
  }

  async getServiceCategory(id: number): Promise<ServiceCategory | undefined> {
    return this.serviceCategories.get(id);
  }

  async createServiceCategory(
    insertCategory: InsertServiceCategory,
  ): Promise<ServiceCategory> {
    const category: ServiceCategory = {
      ...insertCategory,
      id: this.currentCategoryId++,
    };
    this.serviceCategories.set(category.id, category);
    return category;
  }

  // Service Requests
  async getServiceRequest(id: number): Promise<ServiceRequest | undefined> {
    return this.serviceRequests.get(id);
  }

  async getUserServiceRequests(userId: number): Promise<ServiceRequest[]> {
    return Array.from(this.serviceRequests.values()).filter(
      (req) => req.userId === userId,
    );
  }

  async createServiceRequest(
    insertRequest: InsertServiceRequest,
  ): Promise<ServiceRequest> {
    const request: ServiceRequest = {
      ...insertRequest,
      id: this.currentRequestId++,
      status: "pending",
      photos: (insertRequest.photos as string[]) || [],
      baseFee: null,
      itemsFee: null,
      totalCost: null,
      providerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.serviceRequests.set(request.id, request);
    return request;
  }

  async updateServiceRequest(
    id: number,
    updates: Partial<ServiceRequest>,
  ): Promise<ServiceRequest> {
    const request = this.serviceRequests.get(id);
    if (!request) {
      throw new Error("Service request not found");
    }
    const updatedRequest = {
      ...request,
      ...updates,
      updatedAt: new Date(),
    };
    this.serviceRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  // Orders
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId,
    );
  }

  async getProviderOrders(providerId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.providerId === providerId,
    );
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const order: Order = {
      ...insertOrder,
      id: this.currentOrderId++,
      status: "confirmed",
      paymentStatus: "pending",
      rating: null,
      review: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(order.id, order);
    return order;
  }

  async updateOrder(id: number, updates: Partial<Order>): Promise<Order> {
    const order = this.orders.get(id);
    if (!order) {
      throw new Error("Order not found");
    }
    const updatedOrder = {
      ...order,
      ...updates,
      updatedAt: new Date(),
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getUserActiveOrder(userId: number): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(
      (order) =>
        order.userId === userId &&
        !["completed", "cancelled"].includes(order.status),
    );
  }

  // Pricing Items
  async getPricingItemsByCategory(categoryId: number): Promise<PricingItem[]> {
    return Array.from(this.pricingItems.values()).filter(
      (item) => item.categoryId === categoryId,
    );
  }

  async getAllPricingItems(): Promise<PricingItem[]> {
    return Array.from(this.pricingItems.values());
  }

  async createPricingItem(insertItem: InsertPricingItem): Promise<PricingItem> {
    const item: PricingItem = {
      ...insertItem,
      id: this.currentPricingItemId++,
      isAddOn: insertItem.isAddOn || false,
    };
    this.pricingItems.set(item.id, item);
    return item;
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Service Providers
  async getServiceProvider(id: number): Promise<ServiceProvider | undefined> {
    const [provider] = await db
      .select()
      .from(serviceProviders)
      .where(eq(serviceProviders.id, id));
    return provider || undefined;
  }

  async getAllServiceProviders(): Promise<ServiceProvider[]> {
    return await db.select().from(serviceProviders);
  }

  async getAvailableServiceProviders(): Promise<ServiceProvider[]> {
    return await db
      .select()
      .from(serviceProviders)
      .where(eq(serviceProviders.isAvailable, true));
  }

  async createServiceProvider(
    insertProvider: InsertServiceProvider,
  ): Promise<ServiceProvider> {
    const [provider] = await db
      .insert(serviceProviders)
      .values(insertProvider)
      .returning();
    return provider;
  }

  async updateServiceProviderAvailability(
    id: number,
    isAvailable: boolean,
  ): Promise<void> {
    await db
      .update(serviceProviders)
      .set({ isAvailable })
      .where(eq(serviceProviders.id, id));
  }

  // Service Categories
  async getAllServiceCategories(): Promise<ServiceCategory[]> {
    return await db.select().from(serviceCategories);
  }

  async getServiceCategory(id: number): Promise<ServiceCategory | undefined> {
    const [category] = await db
      .select()
      .from(serviceCategories)
      .where(eq(serviceCategories.id, id));
    return category || undefined;
  }

  async createServiceCategory(
    insertCategory: InsertServiceCategory,
  ): Promise<ServiceCategory> {
    const [category] = await db
      .insert(serviceCategories)
      .values(insertCategory)
      .returning();
    return category;
  }

  // Pricing Items
  async getPricingItemsByCategory(categoryId: number): Promise<PricingItem[]> {
    return await db
      .select()
      .from(pricingItems)
      .where(eq(pricingItems.categoryId, categoryId));
  }

  async getAllPricingItems(): Promise<PricingItem[]> {
    return await db.select().from(pricingItems);
  }

  async createPricingItem(insertItem: InsertPricingItem): Promise<PricingItem> {
    const [item] = await db.insert(pricingItems).values(insertItem).returning();
    return item;
  }

  // Service Requests
  async getServiceRequest(id: number): Promise<ServiceRequest | undefined> {
    const [request] = await db
      .select()
      .from(serviceRequests)
      .where(eq(serviceRequests.id, id));
    return request || undefined;
  }

  async getUserServiceRequests(userId: number): Promise<ServiceRequest[]> {
    return await db
      .select()
      .from(serviceRequests)
      .where(eq(serviceRequests.userId, userId));
  }

  async createServiceRequest(
    insertRequest: InsertServiceRequest,
  ): Promise<ServiceRequest> {
    const [request] = await db
      .insert(serviceRequests)
      .values(insertRequest)
      .returning();
    return request;
  }

  async updateServiceRequest(
    id: number,
    updates: Partial<ServiceRequest>,
  ): Promise<ServiceRequest> {
    const [request] = await db
      .update(serviceRequests)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(serviceRequests.id, id))
      .returning();
    return request;
  }

  // Orders
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async getProviderOrders(providerId: number): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.providerId, providerId));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  async updateOrder(id: number, updates: Partial<Order>): Promise<Order> {
    const [order] = await db
      .update(orders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async getUserActiveOrder(userId: number): Promise<Order | undefined> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .limit(1);

    if (order && !["completed", "cancelled"].includes(order.status)) {
      return order;
    }
    return undefined;
  }
}

export const storage = new DatabaseStorage();
