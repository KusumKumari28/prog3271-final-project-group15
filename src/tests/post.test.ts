import request from "supertest";
import app from "../app";

describe("Post API", () => {
  let token = "";

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "123456",
    });

    token = res.body.token;
  });

  it("should create a post", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Post",
        content: "Test content",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.post).toHaveProperty("_id");
  });

  it("should fetch posts", async () => {
    const res = await request(app).get("/api/posts");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.posts)).toBe(true);
  });
});
