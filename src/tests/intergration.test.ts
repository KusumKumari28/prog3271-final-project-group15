import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Integration Tests", () => {
  it("should register, login, and access protected route", async () => {
    const registerRes = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Integration User",
        email: "int@test.com",
        password: "123456",
      });

    expect(registerRes.status).toBe(201);

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "int@test.com",
        password: "123456",
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();

    const token = loginRes.body.token;

    const protectedRes = await request(app)
      .get("/api/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(protectedRes.status).toBe(200);
  });
});