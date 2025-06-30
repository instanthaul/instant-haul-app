import { storage } from "./storage";

async function test() {
  const user = await storage.getUser(1);
  console.log("User 1:", user);
}

test();