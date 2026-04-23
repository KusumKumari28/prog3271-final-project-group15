import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app";
import User from "../models/User";
import Post from "../models/Post";

jest.setTimeout(30000);

let mongoServer: MongoMemoryServer;
let userToken = "";
let adminToken = "";
let postId = "";

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Register and login a regular user
  await request(app).post("/api/auth/register").send({
    name: "Post User",
    email: "postuser@test.com",
    password: "123456",
  });

  const loginRes = await request(app).post("/api/auth/login").send({
    email: "postuser@test.com",
    password: "123456",
  });
  userToken = loginRes.body.token;

  // Register and login an admin user
  await request(app).post("/api/auth/register").send({
    name: "Admin User",
    email: "postadmin@test.com",
    password: "123456",
    role: "admin",
  });

  const adminLoginRes = await request(app).post("/api/auth/login").send({
    email: "postadmin@test.com",
    password: "123456",
  });
  adminToken = adminLoginRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Post API", () => {
  it("should create a post", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ title: "Test Post", content: "Test content" });

    expect(res.statusCode).toBe(201);
    expect(res.body.post).toHaveProperty("_id");
    postId = res.body.post._id;
  });

  it("should fail to create post without auth", async () => {
    const res = await request(app)
      .post("/api/posts")
      .send({ title: "No Auth", content: "No token" });

    expect(res.statusCode).toBe(401);
  });

  it("should fail to create post with missing fields", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ title: "" });

    expect(res.statusCode).toBe(400);
  });

  it("should fetch all posts", async () => {
    const res = await request(app).get("/api/posts");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.posts)).toBe(true);
  });

  it("should fetch post by id", async () => {
    const res = await request(app).get(`/api/posts/${postId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.post._id).toBe(postId);
  });

  it("should return 404 for non-existent post", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/posts/${fakeId}`);

    expect(res.statusCode).toBe(404);
  });

  it("should update own post", async () => {
    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ title: "Updated Title" });

    expect(res.statusCode).toBe(200);
    expect(res.body.post.title).toBe("Updated Title");
  });

  it("should fail to update post with invalid id", async () => {
    const res = await request(app)
      .put(`/api/posts/invalidid`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ title: "Bad Update" });

    expect(res.statusCode).toBe(400);
  });

  it("should admin update any post", async () => {
    const res = await request(app)
      .put(`/api/posts/admin/${postId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "Admin Updated" });

    expect(res.statusCode).toBe(200);
    expect(res.body.post.title).toBe("Admin Updated");
  });

  it("should admin delete a post", async () => {
    const createRes = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ title: "To Delete", content: "content" });

    const deleteId = createRes.body.post._id;

    const res = await request(app)
      .delete(`/api/posts/admin/${deleteId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("should user delete own post", async () => {
    const createRes = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ title: "User Delete", content: "content" });

    const deleteId = createRes.body.post._id;

    const res = await request(app)
      .delete(`/api/posts/${deleteId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("should deny regular user from admin delete", async () => {
    const createRes = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ title: "Protected", content: "content" });

    const protectedId = createRes.body.post._id;

    const res = await request(app)
      .delete(`/api/posts/admin/${protectedId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });
});

