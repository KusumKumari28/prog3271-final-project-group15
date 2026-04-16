import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app";

let mongoServer: MongoMemoryServer;

let userToken = "";
let adminToken = "";
let postId = "";

// Increase timeout (MongoMemoryServer can be slow)
jest.setTimeout(30000);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Full Integration Test", () => {
  // -------------------------
  // REGISTER USERS
  // -------------------------
  it("should register normal user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "User",
      email: "user@test.com",
      password: "123456",
    });

    expect(res.status).toBe(201);
  });

  it("should register admin user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Admin",
      email: "admin@test.com",
      password: "123456",
      role: "admin", // make sure your backend supports this
    });

    expect(res.status).toBe(201);
  });

  // -------------------------
  // LOGIN
  // -------------------------
  it("should login normal user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "user@test.com",
      password: "123456",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();

    userToken = res.body.token;
  });

  it("should login admin user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@test.com",
      password: "123456",
    });

    expect(res.status).toBe(200);
    adminToken = res.body.token;
  });

  // -------------------------
  // CREATE POST
  // -------------------------
  it("should create a post", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        title: "Integration Test Post",
        content: "Testing full flow",
      });

    expect(res.status).toBe(201);
    expect(res.body.post).toHaveProperty("_id");

    postId = res.body.post._id;
  });

  // -------------------------
  // LIKE POST
  // -------------------------
  it("should like the post", async () => {
    const res = await request(app)
      .post(`/api/likes/${postId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(201);
  });

  it("should not allow duplicate like", async () => {
    const res = await request(app)
      .post(`/api/likes/${postId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(400);
  });

  // -------------------------
  // GET POST WITH LIKE COUNT
  // -------------------------
  it("should fetch post with like count", async () => {
    const res = await request(app).get(`/api/posts/${postId}`);

    expect(res.status).toBe(200);
    expect(res.body.post.likeCount).toBeGreaterThanOrEqual(1);
  });

  // -------------------------
  // ADMIN ANALYTICS
  // -------------------------
  it("should fetch admin analytics", async () => {
    const res = await request(app)
      .get("/api/admin/analytics")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.analytics).toHaveProperty("totalUsers");
  });

  // -------------------------
  // ADMIN DELETE POST
  // -------------------------
  it("should delete post as admin", async () => {
    const res = await request(app)
      .delete(`/api/posts/admin/${postId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
  });

  // -------------------------
  // NEGATIVE TESTS (BOOST COVERAGE)
  // -------------------------
  it("should fail creating post without token", async () => {
    const res = await request(app).post("/api/posts").send({
      title: "Fail",
      content: "No token",
    });

    expect(res.status).toBe(401);
  });

  it("should deny analytics for normal user", async () => {
    const res = await request(app)
      .get("/api/admin/analytics")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });
});