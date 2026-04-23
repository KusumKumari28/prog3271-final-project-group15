import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app";
import User from "../models/User";

jest.setTimeout(20000);

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Authentication API Tests", () => {
  it("should register a new user", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@gmail.com",
      password: "123456",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User registered successfully");
    expect(response.body.user.email).toBe("test@gmail.com");
  });

  it("should not register duplicate user", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@gmail.com",
      password: "123456",
    });

    const response = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@gmail.com",
      password: "123456",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User already exists");
  });

  it("should login successfully with correct credentials", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@gmail.com",
      password: "123456",
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "test@gmail.com",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.token).toBeDefined();
  });

  it("should fail login with wrong password", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@gmail.com",
      password: "123456",
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "test@gmail.com",
      password: "wrong123",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid email or password");
  });

  it("should deny access to protected route without token", async () => {
    const response = await request(app).get("/api/protected");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("No token provided");
  });

  it("should access protected route with valid token", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Test User 2",
      email: "test2@gmail.com",
      password: "123456",
    });

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "test2@gmail.com",
      password: "123456",
    });

    const token = loginResponse.body.token;

    const response = await request(app)
      .get("/api/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Protected route accessed");
  });

  it("should access test route", async () => {
    const response = await request(app).get("/api/test");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Test route working");
  });

  it("should deny admin route for normal user", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Test User 3",
      email: "test3@gmail.com",
      password: "123456",
    });

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "test3@gmail.com",
      password: "123456",
    });

    const token = loginResponse.body.token;

    const response = await request(app)
      .get("/api/admin")
      .set("Authorization", `Bearer ${token}`);

    expect([401, 403, 404]).toContain(response.status);
  });
});
