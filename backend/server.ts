import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { storage } from "./storage";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// USERS
app.get("/users/:id", async (req, res) => {
  const user = await storage.getUser(Number(req.params.id));
  if (!user) return res.status(404).send("User not found");
  res.json(user);
});

app.post("/users", async (req, res) => {
  try {
    const newUser = await storage.createUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).send("Failed to create user");
  }
});

// SERVICE PROVIDERS
app.get("/providers", async (req, res) => {
  const providers = await storage.getAllServiceProviders();
  res.json(providers);
});

app.get("/providers/available", async (req, res) => {
  const available = await storage.getAvailableServiceProviders();
  res.json(available);
});

app.patch("/providers/:id/availability", async (req, res) => {
  await storage.updateServiceProviderAvailability(Number(req.params.id), req.body.isAvailable);
  res.send("Availability updated");
});

app.post("/providers", async (req, res) => {
  try {
    const provider = await storage.createServiceProvider(req.body);
    res.status(201).json(provider);
  } catch (err) {
    res.status(500).send("Failed to create provider");
  }
});

// SERVICE CATEGORIES
app.get("/categories", async (req, res) => {
  const categories = await storage.getAllServiceCategories();
  res.json(categories);
});

app.get("/categories/:id", async (req, res) => {
  const category = await storage.getServiceCategory(Number(req.params.id));
  if (!category) return res.status(404).send("Category not found");
  res.json(category);
});

// PRICING ITEMS
app.get("/categories/:categoryId/pricing", async (req, res) => {
  const items = await storage.getPricingItemsByCategory(Number(req.params.categoryId));
  res.json(items);
});

app.get("/pricing-items", async (req, res) => {
  const items = await storage.getAllPricingItems();
  res.json(items);
});

app.post("/pricing-items", async (req, res) => {
  try {
    const item = await storage.createPricingItem(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).send("Failed to create pricing item");
  }
});

// SERVICE REQUESTS
app.get("/requests/:id", async (req, res) => {
  const request = await storage.getServiceRequest(Number(req.params.id));
  if (!request) return res.status(404).send("Request not found");
  res.json(request);
});

app.get("/requests/user/:userId", async (req, res) => {
  const requests = await storage.getUserServiceRequests(Number(req.params.userId));
  res.json(requests);
});

app.post("/requests", async (req, res) => {
  try {
    const request = await storage.createServiceRequest(req.body);
    res.status(201).json(request);
  } catch (err) {
    res.status(500).send("Failed to create request");
  }
});

app.patch("/requests/:id", async (req, res) => {
  try {
    const updated = await storage.updateServiceRequest(Number(req.params.id), req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).send("Failed to update request");
  }
});

// ORDERS
app.get("/orders/:id", async (req, res) => {
  const order = await storage.getOrder(Number(req.params.id));
  if (!order) return res.status(404).send("Order not found");
  res.json(order);
});

app.get("/orders/user/:userId", async (req, res) => {
  const orders = await storage.getUserOrders(Number(req.params.userId));
  res.json(orders);
});

app.get("/orders/provider/:providerId", async (req, res) => {
  const orders = await storage.getProviderOrders(Number(req.params.providerId));
  res.json(orders);
});

app.post("/orders", async (req, res) => {
  try {
    const order = await storage.createOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).send("Failed to create order");
  }
});

app.patch("/orders/:id", async (req, res) => {
  try {
    const order = await storage.updateOrder(Number(req.params.id), req.body);
    res.json(order);
  } catch (err) {
    res.status(500).send("Failed to update order");
  }
});

app.get("/orders/user/:userId/active", async (req, res) => {
  const activeOrder = await storage.getUserActiveOrder(Number(req.params.userId));
  res.json(activeOrder);
});