import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app";

jest.setTimeout(30000);

let mongoServer: MongoMemoryServer;
let token = "";
let postId = "";

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Register and login
  await request(app).post("/api/auth/register").send({
    name: "Like User",
    email: "likeuser@test.com",
    password: "123456",
  });

  const login = await request(app).post("/api/auth/login").send({
    email: "likeuser@test.com",
    password: "123456",
  });
  token = login.body.token;

  // Create a post to like
  const post = await request(app)
    .post("/api/posts")
    .set("Authorization", `Bearer ${token}`)
    .send({ title: "Like Test Post", content: "Like test content" });

  postId = post.body.post._id;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Like API", () => {
  it("should like a post", async () => {
    const res = await request(app)
      .post(`/api/likes/${postId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Post liked successfully");
  });

  it("should not allow duplicate like", async () => {
    const res = await request(app)
      .post(`/api/likes/${postId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Post already liked");
  });

  it("should unlike a post", async () => {
    const res = await request(app)
      .delete(`/api/likes/${postId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Post unliked successfully");
  });

  it("should fail to unlike when not liked", async () => {
    const res = await request(app)
      .delete(`/api/likes/${postId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  it("should fail to like without auth", async () => {
    const res = await request(app).post(`/api/likes/${postId}`);
    expect(res.statusCode).toBe(401);
  });

  it("should fail to unlike with invalid post id", async () => {
    const res = await request(app)
      .delete(`/api/likes/invalidid`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
  });
});
