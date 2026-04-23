import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app";

jest.setTimeout(30000);

let mongoServer: MongoMemoryServer;
let adminToken = "";
let userToken = "";

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Register admin
  await request(app).post("/api/auth/register").send({
    name: "Admin",
    email: "admin@test.com",
    password: "123456",
    role: "admin",
  });

  const adminLogin = await request(app).post("/api/auth/login").send({
    email: "admin@test.com",
    password: "123456",
  });
  adminToken = adminLogin.body.token;

  // Register regular user
  await request(app).post("/api/auth/register").send({
    name: "Regular User",
    email: "regular@test.com",
    password: "123456",
  });

  const userLogin = await request(app).post("/api/auth/login").send({
    email: "regular@test.com",
    password: "123456",
  });
  userToken = userLogin.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Admin API Tests", () => {
  it("should deny access to analytics without token", async () => {
    const res = await request(app).get("/api/admin/analytics");
    expect(res.status).toBe(401);
  });

  it("should deny analytics for regular user", async () => {
    const res = await request(app)
      .get("/api/admin/analytics")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });

  it("should get analytics as admin", async () => {
    const res = await request(app)
      .get("/api/admin/analytics")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.analytics).toHaveProperty("totalUsers");
    expect(res.body.analytics).toHaveProperty("totalPosts");
    expect(res.body.analytics).toHaveProperty("totalComments");
    expect(res.body.analytics).toHaveProperty("totalLikes");
  });

  it("should get all users as admin", async () => {
    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  it("should deny all users route for regular user", async () => {
    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });
});
