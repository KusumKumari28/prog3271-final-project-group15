import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app";

jest.setTimeout(30000);

let mongoServer: MongoMemoryServer;
let userToken = "";
let adminToken = "";
let postId = "";
let commentId = "";

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Register regular user
  await request(app).post("/api/auth/register").send({
    name: "Comment User",
    email: "commentuser@test.com",
    password: "123456",
  });

  const userLogin = await request(app).post("/api/auth/login").send({
    email: "commentuser@test.com",
    password: "123456",
  });
  userToken = userLogin.body.token;

  // Register admin
  await request(app).post("/api/auth/register").send({
    name: "Comment Admin",
    email: "commentadmin@test.com",
    password: "123456",
    role: "admin",
  });

  const adminLogin = await request(app).post("/api/auth/login").send({
    email: "commentadmin@test.com",
    password: "123456",
  });
  adminToken = adminLogin.body.token;

  // Create a post
  const post = await request(app)
    .post("/api/posts")
    .set("Authorization", `Bearer ${userToken}`)
    .send({ title: "Comment Test Post", content: "Post content" });

  postId = post.body.post._id;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Comment API", () => {
  it("should create a comment on a post", async () => {
    const res = await request(app)
      .post(`/api/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ content: "This is a test comment" });

    expect(res.statusCode).toBe(201);
    expect(res.body.comment).toHaveProperty("_id");
    expect(res.body.comment.content).toBe("This is a test comment");
    commentId = res.body.comment._id;
  });

  it("should fail to create comment without auth", async () => {
    const res = await request(app)
      .post(`/api/posts/${postId}/comments`)
      .send({ content: "No auth comment" });

    expect(res.statusCode).toBe(401);
  });

  it("should fail to create comment with empty content", async () => {
    const res = await request(app)
      .post(`/api/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ content: "" });

    expect(res.statusCode).toBe(400);
  });

  it("should fail to create comment on non-existent post", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .post(`/api/posts/${fakeId}/comments`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ content: "Comment on fake post" });

    expect(res.statusCode).toBe(404);
  });

  it("should get all comments for a post", async () => {
    const res = await request(app).get(`/api/posts/${postId}/comments`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.comments)).toBe(true);
    expect(res.body.comments.length).toBeGreaterThan(0);
  });

  it("should fail to get comments with invalid post id", async () => {
    const res = await request(app).get(`/api/posts/invalidid/comments`);
    expect(res.statusCode).toBe(400);
  });

  it("should update own comment", async () => {
    const res = await request(app)
      .put(`/api/posts/comments/${commentId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ content: "Updated comment content" });

    expect(res.statusCode).toBe(200);
    expect(res.body.comment.content).toBe("Updated comment content");
  });

  it("should fail to update comment with empty content", async () => {
    const res = await request(app)
      .put(`/api/posts/comments/${commentId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ content: "" });

    expect(res.statusCode).toBe(400);
  });

  it("should fail to update non-existent comment", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .put(`/api/posts/comments/${fakeId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ content: "Updated" });

    expect(res.statusCode).toBe(404);
  });

  it("should admin delete any comment", async () => {
    // Create a second comment for admin to delete
    const createRes = await request(app)
      .post(`/api/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ content: "Admin will delete this" });

    const toDeleteId = createRes.body.comment._id;

    const res = await request(app)
      .delete(`/api/posts/comments/${toDeleteId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("should delete own comment", async () => {
    const res = await request(app)
      .delete(`/api/posts/comments/${commentId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("should fail to delete non-existent comment", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .delete(`/api/posts/comments/${fakeId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(404);
  });
});
